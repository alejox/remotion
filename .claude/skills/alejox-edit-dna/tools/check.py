#!/usr/bin/env python3
"""Automatic DNA v2 tests on a rendered still: T1 (cyan coverage < 2%, no overlay yellow) and T6 (safe area).

Usage: check.py <still.png> [--short] [--overlay-only <overlay.png>]
T7 needs an overlay-only render (transparent background) to know which pixels are overlay.
"""
import sys
from PIL import Image

YELLOW = (247, 224, 0)
CYAN = (37, 161, 220)
TOL = 30


def share(im, ref):
    px = im.convert("RGB").getdata()
    hits = sum(1 for p in px if all(abs(a - b) <= TOL for a, b in zip(p, ref)))
    return hits / (im.width * im.height)


def safe_area_ok(overlay, short):
    w, h = overlay.size
    if short:
        x0, x1, y0, y1 = w * 0.074, w * 0.87, h * 0.08, h * 0.78
    else:
        x0, x1, y0, y1 = w * 0.05, w * 0.95, h * 0.05, h * 0.95
    a = overlay.convert("RGBA")
    bbox = a.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bbox:
        return True, None
    return bbox[0] >= x0 and bbox[2] <= x1 and bbox[1] >= y0 and bbox[3] <= y1, bbox


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 2
    short = "--short" in args
    im = Image.open(args[0])
    failed = False
    cyan, yellow = share(im, CYAN), share(im, YELLOW)
    ok = cyan < 0.02 and yellow < 0.001
    failed |= not ok
    print(f"T1 cyan {cyan * 100:.2f}% yellow {yellow * 100:.2f}% -> {'PASS' if ok else 'FAIL'}")
    if "--overlay-only" in args:
        ov = Image.open(args[args.index("--overlay-only") + 1])
        ok, bbox = safe_area_ok(ov, short)
        failed |= not ok
        print(f"T6 safe area bbox={bbox} -> {'PASS' if ok else 'FAIL'}")
    else:
        print("T6 skipped (pass --overlay-only <png>)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
