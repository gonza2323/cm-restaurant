import os
import requests
from PIL import Image
from io import BytesIO

NUM_IMAGES = 30
SEED = 20
SIZE = (128, 128)
OUTPUT_DIR = "src/main/resources/avatars"

os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_URL = "https://i.pravatar.cc/512?img="  # download larger, then downscale

headers = {
    "User-Agent": "Mozilla/5.0"
}

for i in range(0, NUM_IMAGES):
    try:
        url = f"{BASE_URL}{i+SEED}"

        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()

        img = Image.open(BytesIO(response.content)).convert("RGB")
        img = img.resize(SIZE, Image.LANCZOS)

        path = os.path.join(OUTPUT_DIR, f"avatar_{i:02d}.jpg")
        img.save(path, quality=85)

        print(f"Saved {path}")

    except Exception as e:
        print(f"Failed {i}: {e}")