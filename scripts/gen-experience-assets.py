"""Build the Experience receipt assets from the owner's drop folder.

    python scripts/gen-experience-assets.py

Inputs (images/experience section):
  experience.png   the owner holding the pink card, transparent background
  7f26f0eb...jpg   the OMONT typewriter reference (white background)

Outputs (public/experience):
  holder.webp      the whole cutout, 1400px wide
  card.webp        the card plus the fingers holding it, cropped from the same
                   pixels so it lines up exactly over holder.webp
  machine.webp     the typewriter from the roller down, background removed
  crumple.jpg      a procedural crumpled-paper shading map, used with multiply

The card's position inside the photo is what the section's geometry is built
on; the numbers are printed at the end and mirrored in experience.tsx.
"""

import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "images/experience section"
OUT = "public/experience"
os.makedirs(OUT, exist_ok=True)

# --- the holder and the card ------------------------------------------------
photo = Image.open(f"{SRC}/experience.png").convert("RGBA")
a = np.asarray(photo).astype(int)
pink = (a[..., 0] > 200) & (a[..., 1] < 90) & (a[..., 2] > 90) & (a[..., 3] > 200)
ys, xs = np.where(pink)
card = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
W, H = photo.size

holder = photo.copy()
holder.thumbnail((1400, 1400), Image.LANCZOS)
holder.save(f"{OUT}/holder.webp", "WEBP", quality=85, method=6)

pad = (12, 70, 0, 100)  # left, top, right, bottom: room for the fingers, none for the shirt
crop_box = (
    max(0, card[0] - pad[0]),
    max(0, card[1] - pad[1]),
    min(W, card[2] + pad[2]),
    min(H, card[3] + pad[3]),
)
crop = np.asarray(photo.crop(crop_box)).copy()
# Above the card only the hand should survive; the shirt cuff in the top-right
# corner would float on its own once the holder fades out.
ch_, cw_ = crop.shape[:2]
crop[: pad[1], int(cw_ * 0.78) :, 3] = 0
Image.fromarray(crop, "RGBA").save(f"{OUT}/card.webp", "WEBP", quality=88, method=6)

# --- the machine ---------------------------------------------------------------
tw = Image.open(f"{SRC}/7f26f0eb4f11d3ace478b3354a4a7a96.jpg").convert("RGB")
ROLLER_Y = 1300
m = np.asarray(tw.crop((0, ROLLER_Y, tw.width, tw.height))).astype(np.float32)
dist = np.abs(m - 255).max(axis=2)
cand = dist < 22
lab, _ = ndimage.label(cand)
border = set(np.unique(lab[0])) | set(np.unique(lab[-1])) | set(np.unique(lab[:, 0])) | set(np.unique(lab[:, -1]))
border.discard(0)
alpha = (~np.isin(lab, list(border))).astype(np.float32)
# the strip of cream paper still showing above the roller goes too
lum = m.mean(axis=2)
sat = m.max(axis=2) - m.min(axis=2)
paper = (lum > 205) & (sat < 40)
paper[70:] = False
alpha[paper] = 0
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))) / 255
machine = Image.fromarray(np.dstack([m, alpha * 255]).astype(np.uint8), "RGBA")
machine.thumbnail((1100, 1100), Image.LANCZOS)
machine.save(f"{OUT}/machine.webp", "WEBP", quality=86, method=6)

# --- crumpled paper shading -------------------------------------------------------
rng = np.random.default_rng(3)
S = 1024
yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
shade = np.zeros((S, S), np.float32)
for _ in range(70):
    ang = rng.uniform(0, np.pi)
    nx, ny = np.cos(ang), np.sin(ang)
    off = rng.uniform(-S * 0.6, S * 0.6)
    d = (xx - S / 2) * nx + (yy - S / 2) * ny - off
    width = rng.uniform(6, 26)
    reach = rng.uniform(60, 260)
    amp = rng.uniform(0.025, 0.07) * rng.choice([-1, 1])
    shade += amp * np.tanh(d / width) * np.exp(-np.abs(d) / reach)
noise = rng.normal(0, 1, (S, S)).astype(np.float32)
noise = ndimage.gaussian_filter(noise, 18) * 0.9 + ndimage.gaussian_filter(noise, 2) * 0.12
shade += noise
# Multiplied onto the paper, so it must stay near white: faint facets, not smoke.
shade = shade / (np.abs(shade).max() + 1e-6)
img = np.clip(0.955 + shade * 0.075, 0.84, 1.0)
Image.fromarray((img * 255).astype(np.uint8), "L").save(f"{OUT}/crumple.jpg", quality=80)

cw, ch = card[2] - card[0], card[3] - card[1]
print("photo", photo.size, "card px", card, "card size", cw, ch)
print("card crop box", crop_box, "crop size", crop_box[2] - crop_box[0], crop_box[3] - crop_box[1])
print("as fractions of card width:")
print("  photoW %.4f photoH %.4f photoLeft %.4f photoTop %.4f" % (W / cw, H / cw, -card[0] / cw, -card[1] / cw))
print("  cropW %.4f cropH %.4f cropLeft %.4f cropTop %.4f cardH %.4f" % ((crop_box[2] - crop_box[0]) / cw, (crop_box[3] - crop_box[1]) / cw, (crop_box[0] - card[0]) / cw, (crop_box[1] - card[1]) / cw, ch / cw))
print("machine", machine.size, "aspect %.4f" % (machine.height / machine.width))
for f in os.listdir(OUT):
    print(f, os.path.getsize(f"{OUT}/{f}") // 1024, "KB")
