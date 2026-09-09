"""Carves every embedded image out of the .doc catalogues.

The first attempt only looked for JPEGs over 120 KB and found two. Word also
stores PNGs, and photos can compress well below that threshold, so scan for both
signatures and keep anything plausibly a photograph.
"""
import glob
import os
import re

SRC = r"C:\Users\Admin\Desktop\Vihaana Engineering\wetransfer_pfa_2026-09-08_0639"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_carved")
os.makedirs(OUT, exist_ok=True)

total = 0
for path in sorted(glob.glob(os.path.join(SRC, "*.doc"))):
    tag = re.sub(r"[^A-Za-z0-9]+", "", os.path.basename(path))[:14]
    data = open(path, "rb").read()
    n = 0

    # JPEG: FFD8FF … FFD9.
    #
    # Taking the FIRST FFD9 truncates any photo carrying an EXIF preview: the
    # small embedded thumbnail ends before the real image does, so the carve
    # stopped early and libjpeg rejected the result. Bound each photo by the
    # NEXT start-of-image instead, then take the last FFD9 inside that window.
    starts = []
    pos = 0
    while True:
        s = data.find(b"\xff\xd8\xff", pos)
        if s == -1:
            break
        starts.append(s)
        pos = s + 3

    keep = []
    for i, s in enumerate(starts):
        limit = starts[i + 1] if i + 1 < len(starts) else len(data)
        e = data.rfind(b"\xff\xd9", s, limit)
        if e == -1:
            continue
        # A start inside a previous image's data is a nested EXIF preview.
        if keep and s < keep[-1][1]:
            continue
        keep.append((s, e + 2))

    for s, end in keep:
        blob = data[s:end]
        if len(blob) < 15000:
            continue
        n += 1
        open(os.path.join(OUT, f"{tag}_j{n:02d}.jpg"), "wb").write(blob)
        total += 1

    # PNG: 89504E470D0A1A0A … IEND
    pos = 0
    while True:
        s = data.find(b"\x89PNG\r\n\x1a\n", pos)
        if s == -1:
            break
        e = data.find(b"IEND", s)
        if e == -1:
            break
        blob = data[s : e + 8]
        pos = e + 8
        if len(blob) < 15000:
            continue
        n += 1
        open(os.path.join(OUT, f"{tag}_p{n:02d}.png"), "wb").write(blob)
        total += 1

    print(f"{os.path.basename(path)[:46]:48} {n} images")

print(f"\n{total} carved -> _carved")
