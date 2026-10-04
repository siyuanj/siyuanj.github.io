"""Update content-based cache keys; unrelated commits keep asset URLs stable."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    "site_css": ["assets/css/site.scss", "_sass/site-base.scss", "_sass/site-layout.scss"],
    "publication_css": ["assets/css/publication-cards.css"],
    "site_js": ["assets/js/site.js"],
}
versions = {}
for key, paths in SOURCES.items():
    versions[key] = hashlib.sha256(b"\0".join((ROOT / name).read_bytes() for name in paths)).hexdigest()[:12]
(ROOT / "_data/asset_versions.json").write_text(json.dumps(versions, indent=2) + "\n", encoding="utf-8")
print(json.dumps(versions))
