from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def iter_markdown_files(content_dir: Path) -> list[Path]:
    return sorted(path for path in content_dir.rglob("*.md") if path.is_file())


def is_external_link(target: str) -> bool:
    prefixes = ("http://", "https://", "mailto:", "#")
    return target.startswith(prefixes)


def normalize_local_target(source_file: Path, target: str) -> Path:
    clean_target = target.split("#", 1)[0].split("?", 1)[0].strip()
    return (source_file.parent / clean_target).resolve()


def validate_links() -> list[str]:
    errors: list[str] = []

    for md_file in iter_markdown_files(CONTENT_DIR):
        text = md_file.read_text(encoding="utf-8")

        for _, target in LINK_RE.findall(text):
            target = target.strip()
            if not target or is_external_link(target):
                continue

            resolved = normalize_local_target(md_file, target)
            if not resolved.exists():
                rel_file = md_file.relative_to(ROOT).as_posix()
                errors.append(f"{rel_file}: broken link -> {target}")

    return errors


def main() -> None:
    errors = validate_links()

    if errors:
        print("Broken links found:")
        for error in errors:
            print(f" - {error}")
        sys.exit(1)

    print("All local markdown links are valid.")


if __name__ == "__main__":
    main()
