from __future__ import annotations

import shutil
from pathlib import Path

from scripts.build_web import ROOT
from scripts.build_web import main as build_web


def package_pages(output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / "web", output / "web", dirs_exist_ok=True)
    shutil.copytree(ROOT / "content", output / "content", dirs_exist_ok=True)
    (output / ".nojekyll").touch()
    (output / "index.html").write_text(
        '<!doctype html>\n<html lang="ru"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        '<meta http-equiv="refresh" content="0;url=web/">'
        '<title>Interview Practice</title></head>'
        '<body><a href="web/">Открыть тренажёр</a></body></html>\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    build_web()
    package_pages(ROOT / "_site")
    print("GitHub Pages site built in _site/")
