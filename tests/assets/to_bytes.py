#!/usr/bin/env python3

from PIL import Image
from io import BytesIO

with Image.open("start.png") as img:
    buffer = img.tobytes("raw")
    with open("start.bin", "wb") as binfile:
        binfile.write(buffer)
