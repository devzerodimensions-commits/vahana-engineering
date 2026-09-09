"""Extracts the FULL technical specification of every machine in the six client
catalogues, into _scripts/_catalogue-specs.json keyed by model number.

Why this exists: the site's spec tables were summarised, not complete. The
Carbon Black apparatus showed 13 rows against the catalogue's 19 — "End
closures", "Pre treatment attachment", "Post treatment attachment", "Timer" and
"Timer range" were all missing, and "Effective furnace size" had been folded
into the "Furnace" row.

Format notes:
  .doc  - Word 97 binary. Paragraphs end with \\r and the label/value cells are
          separated by a TAB. The earlier extractor replaced every non-printable
          character with a space, which destroyed exactly the tab that marks the
          split — so rows read "System statusDigital" and could not be parsed.
  .docx - a zip; specs live in real tables, so read w:tc cells per w:tr row.

Run:  python extract-specs.py
"""
import glob
import json
import os
import re
import zipfile

SRC = r"C:\Users\Admin\Desktop\Vihaana Engineering\wetransfer_pfa_2026-09-08_0639"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_catalogue-specs.json")

# Rows that are not specifications.
SKIP_LABEL = re.compile(
    r"^(technical specification|specification)s?\s*:?\s*$|^INCLUDEPICTURE|^\s*$", re.I
)
NOISE = re.compile(r"INCLUDEPICTURE|MERGEFORMAT|^[A-Za-z]:[\\/]|\.jpg|\.zip", re.I)


SMART = {
    "‘": "'", "’": "'",   # curly single quotes
    "“": '"', "”": '"',   # curly double quotes — used as the INCH mark
    " ": " ",
}


def clean(s):
    # Convert smart punctuation before filtering. The catalogues write sizes as
    # 18” (45cm); stripping U+201D silently turned that into "18 (45cm)" and lost
    # the unit.
    for a, b in SMART.items():
        s = s.replace(a, b)
    s = re.sub(r"[^\x20-\x7E°Ø±×–—µΩ²³]", " ", s)
    s = re.sub(r"\s{2,}", " ", s).strip(" :\t")
    # "800oC" / "-10 oC" -> proper degree sign, matching the existing spec tables.
    s = re.sub(r"(?<=\d)\s*oC\b", " °C", s)
    return s


def is_noise(text):
    """True for Word's internal binary tail rather than readable spec text.

    The 2500-byte window past each "Model no." sometimes runs off the end of the
    table into fast-save revision data, which decoded to rows like
    "9 : ; < I K m n o p x y z {". Real spec text is mostly letters, digits and
    spaces, and rarely a parade of single characters.
    """
    if not text:
        return True

    # Short values are legitimately symbol-heavy: "1°C" is 2 alphanumerics out of
    # 3 characters, which the ratio test below scored as noise and deleted —
    # taking "Temperature least count" off several machines. Only require that a
    # short value contains something alphanumeric at all.
    if len(text) < 20:
        return not any(c.isalnum() for c in text)

    letters = sum(c.isalnum() or c.isspace() for c in text)
    if letters / len(text) < 0.72:
        return True
    tokens = text.split()
    singles = sum(1 for t in tokens if len(t) == 1)
    return len(tokens) >= 6 and singles / len(tokens) > 0.5


def seen_before(machine, text):
    """Word stores earlier revisions of a paragraph again further down the file.
    Those re-appeared as continuations and repeated the Accessories sentence
    three times inside the Carbon Black "Power supply" value.
    """
    probe = re.sub(r"\W+", "", text.lower())[:40]
    if len(probe) < 12:
        return False
    return any(probe in re.sub(r"\W+", "", s["value"].lower()) for s in machine["specs"])


def classify(para):
    """Sort one paragraph into a spec row, a continuation of the previous row,
    or plain text.

    Continuations matter: a long value wraps to the next paragraph, which starts
    with tabs and carries NO label —

        Test capacity\\t\\tLoad cell 1: 500 kgf / 5000 N,
        \\t\\tLoadcell 2: 50 kgf / 500 N          <- continuation

    Treating that second line as a heading (because it has no label) silently
    truncated the value. Several machines lost half a row this way.
    """
    if "\t" in para:
        parts = para.split("\t")
        first = clean(parts[0])
        rest = [clean(p) for p in parts[1:]]
        rest = [p for p in rest if p]
        if not first and rest:
            return ("cont", None, " ".join(rest))
        if first and rest:
            return ("row", first, " ".join(rest))
        if first:
            return ("text", first, None)
        return (None, None, None)

    text = clean(para)
    return ("text", text, None) if text else (None, None, None)


def block_name(lines, model_idx):
    """The machine's name, found by scanning BACKWARDS from its "Model no." row.

    Deriving the name here rather than tracking the most recent text line means
    the continuation logic no longer has to guess whether a line is a heading.
    That guesswork was rejecting real continuations ("16 Ton hydraulic jack"
    starts with a digit, not a lower-case letter) while still letting Word's
    duplicated revision text slip in.
    """
    for j in range(model_idx - 1, max(-1, model_idx - 8), -1):
        cand = clean(lines[j].replace("\t", " "))
        if not cand or len(cand) < 4:
            continue
        if SKIP_LABEL.match(cand) or re.match(r"^\(.*\)$", cand):
            continue          # "Technical Specification" / "(Computer interface…)"
        if is_noise(cand):
            continue
        return cand
    return None


def parse_blocks(lines):
    """Walk the line list and yield one dict per machine.

    A block runs from its "Model no." row to the next machine's heading. Inside
    it, every line that isn't a labelled row is a continuation of the row above —
    which is what Word's layout means — so nothing has to be inferred from
    capitalisation.
    """
    model_rows = []
    for i, line in enumerate(lines):
        kind, label, _ = classify(line)
        if kind == "row" and re.match(r"^model\s*no", label or "", re.I):
            model_rows.append(i)

    for n, start in enumerate(model_rows):
        end = model_rows[n + 1] if n + 1 < len(model_rows) else len(lines)
        _, _, model_value = classify(lines[start])
        model = re.sub(r"\s+", "", model_value or "")
        if not model:
            continue

        specs = [{"label": "Model No.", "value": model}]
        for k in range(start + 1, end):
            kind, label, value = classify(lines[k])
            if kind is None:
                continue
            if kind == "row":
                # A label must contain a real word. "$ % = > H J" survived the
                # noise test (it has letters) but is Word field data, not a spec.
                if not re.search(r"[A-Za-z]{3}", label or ""):
                    continue
                if is_noise(label) or is_noise(value) or len(label) < 3:
                    continue
                specs.append({"label": label, "value": value})
                continue

            text = value if kind == "cont" else label
            if not text or is_noise(text):
                continue
            # The next machine's heading ends this block.
            if kind == "text" and block_starts_here(lines, k, end):
                break
            if len(specs[-1]["value"]) + len(text) > 320:
                continue
            probe = re.sub(r"\W+", "", text.lower())[:40]
            if len(probe) >= 12 and any(probe in re.sub(r"\W+", "", s["value"].lower()) for s in specs):
                continue          # Word's duplicated revision text
            joiner = "" if specs[-1]["value"].endswith(("-", "/")) else " "
            specs[-1]["value"] = (specs[-1]["value"] + joiner + text).strip()

        yield {"model": model, "name": block_name(lines, start) or model, "specs": specs}


SPEC_HEADING = re.compile(r"^(technical\s+specification|specification)s?\s*:?\s*$", re.I)


def block_starts_here(lines, k, end):
    """True if line k is the heading of the NEXT machine — i.e. an actual
    "Technical Specification" line follows within a couple of lines.

    Must NOT use SKIP_LABEL here: that pattern also matches an empty string, so
    any text line followed by a blank one looked like the start of a new machine
    and ended the block early. That silently dropped each table's LAST row —
    "Power supply" disappeared from seven machines.
    """
    for j in range(k + 1, min(k + 4, end)):
        if SPEC_HEADING.match(clean(lines[j].replace("\t", " ")) or ""):
            return True
    return False


def rows_from_doc(path):
    """Yield (kind, label, value) for a Word 97 .doc.

    Only the neighbourhood of each "Model no." is scanned. Walking every
    paragraph took >10 minutes of CPU: these files are 38-68 MB of embedded
    photos, and the binary contains millions of stray \\r bytes, so a full split
    produces ~1M junk fragments to regex over. Each machine block is a few
    hundred bytes around its model number, so seek to those instead.
    """
    raw = open(path, "rb").read().decode("cp1252", "ignore")

    # Case-insensitive: the catalogues use both "Model no." and "Model No.",
    # and a case-sensitive scan silently skipped every block using the latter
    # (the Tensile WST machine among them).
    for m in re.finditer(r"model\s*no", raw, re.I):
        start = max(0, m.start() - 400)          # back far enough for the heading
        window = raw[start : m.start() + 2500]   # forward over the spec rows

        started = False
        for para in window.split("\r"):
            kind, label, value = classify(para)
            if kind == "row":
                if re.match(r"^model\s*no", label, re.I):
                    if started:
                        break                # next machine begins — stop this block
                    started = True
                yield ("row", label, value)
            elif kind == "cont":
                yield ("cont", None, value)
            elif kind == "text":
                # A heading after the rows have started means the block ended.
                if started and label.isupper() and len(label) > 5:
                    break
                yield ("text", label, None)


def rows_from_docx(path):
    """Yield (kind, label, value) for a .docx.

    These documents contain NO tables — checked: zero <w:tbl>. The spec rows are
    ordinary paragraphs where label and value are separated by <w:tab/> elements
    (often several, for alignment). Stripping the tags without first converting
    those tabs is what produced "System statusDigital" and made the rows
    unparseable.
    """
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf8", "ignore")

    xml = re.sub(r"<w:tab\s*/>", "\t", xml)          # preserve the separator
    xml = re.sub(r"</w:p>", "\n", xml)               # one paragraph per line
    text = re.sub(r"<[^>]+>", "", xml)

    for para in text.split("\n"):
        kind, label, value = classify(para)
        if kind == "row":
            yield ("row", label, value)
        elif kind == "cont":
            yield ("cont", None, value)
        elif kind == "text":
            yield ("text", label, None)


def chunks_of(path):
    """Yield independent line-lists to parse.

    Returns CHUNKS, not one flat list. For .doc a separate window is taken around
    each "Model no." (walking every paragraph took >10 minutes of CPU — the files
    are 38-68 MB of embedded photos with millions of stray \\r bytes). Those
    windows overlap, so flattening them put the same machine's model row inside
    the previous machine's block and truncated it. Parsing each window on its own
    keeps block boundaries honest.
    """
    if path.lower().endswith(".docx"):
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml").decode("utf8", "ignore")
        xml = re.sub(r"<w:tab\s*/>", "\t", xml)
        xml = re.sub(r"</w:p>", "\n", xml)
        yield re.sub(r"<[^>]+>", "", xml).split("\n")
        return

    raw = open(path, "rb").read().decode("cp1252", "ignore")
    for m in re.finditer(r"model\s*no", raw, re.I):
        # 4500, not 2500: the longer tables (Humidity Chamber, Tensile) run past
        # 2500 bytes and their LAST row — invariably "Power supply" — fell outside
        # the window and vanished from seven machines. Overshooting into the next
        # machine is harmless: parse_blocks stops at its model row, and the
        # richest version of each machine wins.
        yield raw[max(0, m.start() - 400) : m.start() + 4500].split("\r")


machines = {}

for path in sorted(glob.glob(os.path.join(SRC, "*.doc*"))):
    name = os.path.basename(path)
    found_here = 0

    blocks = [b for chunk in chunks_of(path) for b in parse_blocks(chunk)]
    for block in blocks:
        model = block["model"]
        if model not in machines:
            machines[model] = {"model": model, "name": block["name"], "specs": block["specs"], "sources": []}
            found_here += 1
        else:
            # Keep the richest version — the same machine repeats across
            # catalogues and one copy is sometimes cut short.
            if len(block["specs"]) > len(machines[model]["specs"]):
                machines[model]["specs"] = block["specs"]
        if name not in machines[model]["sources"]:
            machines[model]["sources"].append(name)

    print(f"{name[:52]:54} {found_here:2} machines")

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump({"count": len(machines), "machines": list(machines.values())}, fh, indent=2)

print(f"\n{len(machines)} distinct machines -> _catalogue-specs.json")
for m in sorted(machines.values(), key=lambda x: x["model"]):
    print(f"  {m['model']:16} {len(m['specs']):2} rows   {m['name'][:46]}")
