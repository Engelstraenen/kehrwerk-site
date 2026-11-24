# Manifest: nur vorhandene Dateien lädt die Seite (keine 404, keine Platzhalter)
from pathlib import Path
import json
a = Path(__file__).resolve().parent.parent / "site/assets"
vid = sorted(p.stem for p in (a / "vid").glob("*.mp4"))
img = sorted(p.stem for p in (a / "img").glob("*.webp") if not p.stem.endswith("-m"))
(a / "manifest.js").write_text("window.KW_ASSETS=" + json.dumps({"vid": vid, "img": img}) + ";\n")
print(vid, img)
