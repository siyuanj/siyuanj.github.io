"""Generate uncropped web previews; original images stay byte-identical."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    "xuetui-poster-natural-illustrated": (ROOT / "assets/img/photos/xuetui-poster-natural-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
    "baker-rosettacon-asia-natural-illustrated": (ROOT / "assets/img/photos/baker-rosettacon-asia-natural-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
    "avatar": (ROOT / "assets/img/jiangsiyuan.png", ROOT / "assets/img/profile", [320, 480]),
    "gpcr-turbo": (ROOT / "assets/img/publications/gpcr-turbo-framework.png", ROOT / "assets/img/publications", [600, 1200]),
    "structrace": (ROOT / "assets/img/publications/structrace-framework.png", ROOT / "assets/img/publications", [600, 1200]),
    "golden-gate-2026-09-26": (ROOT / "assets/img/photos/golden-gate-2026-09-26.png", ROOT / "assets/img/photos", [640, 1280]),
    "google-2026-09-24-natural-illustrated": (ROOT / "assets/img/photos/google-2026-09-24-natural-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
    "nvidia-2026-09-24-selected-illustrated": (ROOT / "assets/img/photos/nvidia-2026-09-24-selected-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
    "griffith-2026-09-23-natural-illustrated": (ROOT / "assets/img/photos/griffith-2026-09-23-natural-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
    "ucla-bear-2026-09-23-natural-illustrated": (ROOT / "assets/img/photos/ucla-bear-2026-09-23-natural-illustrated.png", ROOT / "assets/img/photos", [640, 1280]),
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def generate(names=None):
    report = {}
    # This trusted paper overview has 100M pixels; never accept arbitrary image inputs here.
    Image.MAX_IMAGE_PIXELS = 110_000_000
    for name, (source, output_dir, widths) in SPECS.items():
        if names and name not in names:
            continue
        original_hash = digest(source)
        output_dir.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as original:
            original.load()
            entries = []
            for width in widths:
                height = round(original.height * width / original.width)
                preview = original.resize((width, height), Image.Resampling.LANCZOS)
                destination = output_dir / (name + "-" + str(width) + ".webp")
                illustrated = name.endswith("-illustrated")
                preview.save(destination, "WEBP", lossless=not illustrated, quality=90, method=6)
                with Image.open(destination) as reopened:
                    assert reopened.size == (width, height)
                    if not illustrated:
                        assert reopened.convert("RGBA").tobytes() == preview.convert("RGBA").tobytes()
                entries.append({"path": str(destination.relative_to(ROOT)), "width": width,
                                "height": height, "bytes": destination.stat().st_size,
                                "sha256": digest(destination), "lossless": not illustrated,
                                "quality": 90 if illustrated else None})
        assert digest(source) == original_hash
        report[name] = {"source": str(source.relative_to(ROOT)), "source_sha256": original_hash,
                        "original_unchanged": True, "previews": entries}
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", required=True, type=Path)
    parser.add_argument("--only", nargs="+", choices=list(SPECS))
    config = parser.parse_args()
    report = generate(config.only)
    if config.only and config.report.exists():
        previous = json.loads(config.report.read_text())
        previous.update(report)
        report = previous
    config.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(config.report)
