"""Independent check on the extraction.

Counts the labelled rows the source contains for each machine and compares with
_catalogue-specs.json. The boundary is model-number to NEXT model-number in the
raw bytes — deliberately not the same rule the extractor uses, so this can catch
the extractor being wrong rather than just agreeing with it.

An earlier version of this audit used a fixed 2500-byte window, which spanned
several machines and reported 40 "source rows" for a machine that has 19. Do not
trust a bound that isn't tied to the next machine.

Run:  python audit-specs.py
"""
import glob
import json
import os
import re
import zipfile

SRC = r"C:\Users\Admin\Desktop\Vihaana Engineering\wetransfer_pfa_2026-09-08_0639"
HERE = os.path.dirname(os.path.abspath(__file__))
SPECS = json.load(open(os.path.join(HERE, "_catalogue-specs.json"), encoding="utf-8"))
stored = {m["model"].lower(): m for m in SPECS["machines"]}


def text_of(path):
    if path.lower().endswith(".docx"):
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml").decode("utf8", "ignore")
        xml = re.sub(r"<w:tab\s*/>", "\t", xml)
        xml = re.sub(r"</w:p>", "\r", xml)
        return re.sub(r"<[^>]+>", "", xml)
    return open(path, "rb").read().decode("cp1252", "ignore")


def labelled_rows(segment):
    """Labels of rows in a segment: a tab, a non-empty label, a non-empty value."""
    out = []
    for para in segment.split("\r"):
        if "\t" not in para:
            continue
        first = re.sub(r"[^\x20-\x7E]", " ", para.split("\t")[0]).strip()
        rest = re.sub(r"[^\x20-\x7E]", " ", "".join(para.split("\t")[1:])).strip()
        if first and rest and len(first) >= 3:
            out.append(first)
    return out


best = {}   # model -> richest source row list seen
for path in sorted(glob.glob(os.path.join(SRC, "*.doc*"))):
    raw = text_of(path)
    hits = [m.start() for m in re.finditer(r"model\s*no", raw, re.I)]
    for n, i in enumerate(hits):
        end = hits[n + 1] if n + 1 < len(hits) else min(len(raw), i + 3000)
        seg = raw[i:end]
        rows = labelled_rows(seg)
        if not rows:
            continue
        m = re.search(r"(VE-[A-Za-z0-9\-]+|K-[A-Za-z0-9\-]+)", seg)
        if not m:
            continue
        model = m.group(1)
        if model not in best or len(rows) > len(best[model]):
            best[model] = rows

print(f"{'MODEL':16} {'SOURCE':>6} {'STORED':>6}  MISSING")
print("-" * 74)
problems = 0
for model, rows in sorted(best.items()):
    got = stored.get(model.lower())
    if not got:
        print(f"{model:16} {len(rows):6} {'--':>6}  NOT EXTRACTED")
        problems += 1
        continue
    have = {s["label"].lower() for s in got["specs"]}
    missing = [r for r in rows if r.lower() not in have and not r.lower().startswith("model")]
    if missing:
        problems += 1
        print(f"{model:16} {len(rows):6} {len(got['specs']):6}  {', '.join(missing[:4])}")

print("-" * 74)
print("All source rows present." if not problems else f"{problems} machines with missing rows.")
