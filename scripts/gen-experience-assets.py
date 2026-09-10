"""Build the Experience receipt's paper texture.

    python scripts/gen-experience-assets.py

Writes public/experience/crumple.jpg: a procedural crumpled-paper shading map
(random crease planes plus low-frequency noise), kept near white because it is
multiplied onto the paper colour. No external source.
"""

import os

import numpy as np
from PIL import Image
from scipy import ndimage

OUT = "public/experience"
os.makedirs(OUT, exist_ok=True)

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
shade = shade / (np.abs(shade).max() + 1e-6)
img = np.clip(0.955 + shade * 0.075, 0.84, 1.0)
Image.fromarray((img * 255).astype(np.uint8), "L").save(f"{OUT}/crumple.jpg", quality=80)
print("crumple.jpg", os.path.getsize(f"{OUT}/crumple.jpg") // 1024, "KB")
