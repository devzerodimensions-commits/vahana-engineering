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
            if "\t" in para:
                parts = [clean(p) for p in para.split("\t")]
                parts = [p for p in parts if p]
                if len(parts) >= 2:
                    if re.match(r"^model\s*no", parts[0], re.I):
                        if started:
                            break            # next machine begins — stop this block
                        started = True
                    yield ("row", parts[0], " ".join(parts[1:]))
                    continue
            text = clean(para)
            if not text:
                continue
            # A heading after the rows have started means the block has ended.
            if started and text.isupper() and len(text) > 5:
                break
            yield ("text", text, None)


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
        if "\t" in para:
            parts = [clean(p) for p in para.split("\t")]
            parts = [p for p in parts if p]
            if len(parts) >= 2:
                yield ("row", parts[0], " ".join(parts[1:]))
                continue
        line = clean(para)
        if line:
            yield ("text", line, None)


machines = {}

for path in sorted(glob.glob(os.path.join(SRC, "*.doc*"))):
    name = os.path.basename(path)
    reader = rows_from_docx if path.lower().endswith(".docx") else rows_from_doc

    heading = None          # most recent non-spec line = candidate machine name
    current = None          # model currently being filled
    found_here = 0

    for kind, a, b in reader(path):
        if NOISE.search(a or "") or NOISE.search(b or ""):
            continue

        if kind == "text":
            # Skip wholly parenthetical subtitles — "(Computer interface system)"
            # sits between the machine name and its spec table, and taking the
            # nearest line named several machines after their subtitle instead.
            if SKIP_LABEL.match(a) or len(a) <= 3 or re.match(r"^\(.*\)$", a):
                continue
            heading = a
            continue

        label, value = a, b
        if SKIP_LABEL.match(label):
            continue

        # "Model no." starts a new machine block.
        if re.match(r"^model\s*no", label, re.I):
            model = re.sub(r"\s+", "", value)
            title = heading or model
            current = model
            if model not in machines:
                machines[model] = {"model": model, "name": title, "specs": [], "sources": []}
                found_here += 1
            if name not in machines[model]["sources"]:
                machines[model]["sources"].append(name)
            # Model no. is itself the first spec row.
            if not any(s["label"].lower().startswith("model") for s in machines[model]["specs"]):
                machines[model]["specs"].append({"label": "Model No.", "value": model})
            continue

        if current and value:
            existing = machines[current]["specs"]
            if not any(s["label"].lower() == label.lower() for s in existing):
                existing.append({"label": label, "value": value})

    print(f"{name[:52]:54} {found_here:2} machines")

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump({"count": len(machines), "machines": list(machines.values())}, fh, indent=2)

print(f"\n{len(machines)} distinct machines -> _catalogue-specs.json")
for m in sorted(machines.values(), key=lambda x: x["model"]):
    print(f"  {m['model']:16} {len(m['specs']):2} rows   {m['name'][:46]}")
