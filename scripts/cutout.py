"""Cut a sticker out of a flat-background photo and save it as a trimmed WebP.

    python scripts/cutout.py IN OUT [--mode flood|rembg] [--tol 40] [--split]
                             [--crop T,R,B,L] [--max 480] [--min-area 0.002]

flood  (default) treats the border colour as background and floods it in from
       the edges, so enclosed light areas inside the sticker survive. Edge
       pixels are de-fringed against the background colour.
rembg  runs the u2net matting model, for backgrounds that are not one flat
       colour (patterns, checkerboards, low contrast).
--split saves every separate piece as OUT-01.webp, OUT-02.webp, ... (a sticker
       sheet, a set of worms), ordered top-left to bottom-right.
--crop strips pixels off the edges first (screenshot chrome).
"""

import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def flood_alpha(rgb: np.ndarray, tol: float) -> np.ndarray:
    h, w, _ = rgb.shape
    ring = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3), rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
    bg = np.median(ring, axis=0)
    dist = np.abs(rgb - bg).max(axis=2)
    candidate = dist < tol
    labels, n = ndimage.label(candidate)
    border = set(np.unique(labels[0])) | set(np.unique(labels[-1])) | set(np.unique(labels[:, 0])) | set(np.unique(labels[:, -1]))
    border.discard(0)
    background = np.isin(labels, list(border))
    alpha = (~background).astype(np.float32)
    # soft edge: inside the flood boundary, ramp alpha with colour distance
    edge = ndimage.binary_dilation(background, iterations=1) & ~background
    ramp = np.clip((dist - tol * 0.5) / (tol * 0.5), 0, 1)
    alpha[edge] = np.maximum(ramp[edge], 0.35)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))) / 255.0
    alpha[background & ~edge] = 0
    # de-fringe: remove the background colour mixed into partially covered pixels
    a = alpha[..., None]
    rgb_clean = np.where(a > 0.02, (rgb - (1 - a) * bg) / np.maximum(a, 0.02), rgb)
    return np.clip(rgb_clean, 0, 255), alpha


def rembg_alpha(img: Image.Image):
    from rembg import new_session, remove

    out = remove(img, session=new_session("isnet-general-use"), post_process_mask=True)
    arr = np.asarray(out.convert("RGBA")).astype(np.float32)
    return arr[..., :3], arr[..., 3] / 255.0


def trim(rgba: Image.Image, pad: int = 2) -> Image.Image:
    box = rgba.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        return rgba
    l, t, r, b = box
    return rgba.crop((max(0, l - pad), max(0, t - pad), min(rgba.width, r + pad), min(rgba.height, b + pad)))


def save(rgba: Image.Image, path: str, max_side: int) -> None:
    rgba = trim(rgba)
    if max(rgba.size) > max_side:
        rgba.thumbnail((max_side, max_side), Image.LANCZOS)
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    rgba.save(path, "WEBP", quality=90, method=6)
    print(f"{path}  {rgba.width}x{rgba.height}  {os.path.getsize(path) // 1024}KB")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("out")
    p.add_argument("--mode", choices=["flood", "rembg"], default="flood")
    p.add_argument("--tol", type=float, default=40)
    p.add_argument("--split", action="store_true")
    p.add_argument("--crop", default="0,0,0,0", help="top,right,bottom,left pixels to strip first")
    p.add_argument("--max", type=int, default=480, help="longest side of the output")
    p.add_argument("--min-area", type=float, default=0.002, help="drop pieces smaller than this fraction of the image")
    a = p.parse_args()

    img = Image.open(a.src).convert("RGB")
    t, r, b, l = (int(v) for v in a.crop.split(","))
    if any((t, r, b, l)):
        img = img.crop((l, t, img.width - r, img.height - b))
    rgb = np.asarray(img).astype(np.float32)

    if a.mode == "rembg":
        rgb, alpha = rembg_alpha(img)
    else:
        rgb, alpha = flood_alpha(rgb, a.tol)

    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")

    if not a.split:
        save(im, a.out, a.max)
        return

    solid = alpha > 0.3
    solid = ndimage.binary_dilation(solid, iterations=6)
    labels, n = ndimage.label(solid)
    pieces = []
    for i in range(1, n + 1):
        ys, xs = np.where(labels == i)
        if len(ys) < a.min_area * alpha.size:
            continue
        pieces.append((ys.min(), xs.min(), ys.max(), xs.max()))
    # order top-left to bottom-right, in bands
    pieces.sort(key=lambda bb: (round(bb[0] / (im.height / 3)), bb[1]))
    root, ext = os.path.splitext(a.out)
    for k, (y0, x0, y1, x1) in enumerate(pieces, 1):
        save(im.crop((x0, y0, x1 + 1, y1 + 1)), f"{root}-{k:02d}{ext}", a.max)
    if not pieces:
        sys.exit("no pieces found")


if __name__ == "__main__":
    main()
