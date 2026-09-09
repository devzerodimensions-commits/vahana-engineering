"""Extracts plain text from the six client product catalogues.

Replaces the original Word-COM approach, which took minutes per file and
produced nothing usable: the .doc files are 38-68 MB because every machine photo
is embedded, and Word had to fully render each one.

Both formats are read directly instead:
  .docx - a zip; word/document.xml with the tags stripped
  .doc  - Word 97 binary. The paragraph text is stored as cp1252 with \\r
          paragraph marks, so it can be pulled straight out of the bytes. The
          binary noise around it is dropped by keeping only printable ASCII.

Output: _scripts/_catalogue-text/<name>.txt, one paragraph per line, which is
what make-standards.mjs expects.

Run:  python extract-catalogues.py
"""
import glob
import os
import re
import zipfile

SRC = r"C:\Users\Admin\Desktop\Vihaana Engineering\wetransfer_pfa_2026-09-08_0639"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_catalogue-text")
os.makedirs(OUT, exist_ok=True)


def clean_lines(raw_lines):
    """Drop binary noise, embedded-image paths and field codes."""
    out = []
    for line in raw_lines:
        line = re.sub(r"[^\x20-\x7E]", " ", line)      # printable ASCII only
        line = re.sub(r"\s{2,}", " ", line).strip()
        if not line or len(line) < 3:
            continue
        if "INCLUDEPICTURE" in line or "MERGEFORMAT" in line:
            continue
        if re.match(r"^[\\/A-Za-z]:[\\/]", line):       # stray file paths
            continue
        # Word binary leaves runs of punctuation/control junk; require letters.
        if not re.search(r"[A-Za-z]{3}", line):
            continue
        out.append(line)
    return out


def from_docx(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf8", "ignore")
    xml = re.sub(r"</w:p>", "\n", xml)
    xml = re.sub(r"<[^>]+>", "", xml)
    return clean_lines(xml.split("\n"))


def from_doc(path):
    with open(path, "rb") as fh:
        text = fh.read().decode("cp1252", "ignore")
    # Word 97 uses \r as the paragraph mark. Split there, then also split on the
    # runs of spaces that separate table cells so headings land on their own line.
    parts = []
    for para in text.split("\r"):
        para = re.sub(r"[^\x20-\x7E]", " ", para)
        # "NAME  Technical Specification  Model no.  VE-X" -> separate lines
        para = re.sub(r"\s{2,}", "\n", para)
        parts.extend(para.split("\n"))
    return clean_lines(parts)


total = 0
for path in sorted(glob.glob(os.path.join(SRC, "*.doc*"))):
    name = os.path.splitext(os.path.basename(path))[0]
    try:
        lines = from_docx(path) if path.lower().endswith(".docx") else from_doc(path)
        target = os.path.join(OUT, name + ".txt")
        with open(target, "w", encoding="utf-8") as fh:
            fh.write("\n".join(lines))
        models = len(set(re.findall(r"VE-[A-Za-z0-9\-]+", "\n".join(lines))))
        print(f"OK   {name[:52]:54} {len(lines):5} lines  {models:2} models")
        total += 1
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL {name[:52]:54} {exc}")

print(f"\n{total}/6 catalogues extracted -> {OUT}")
