from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def iter_markdown_files(content_dir: Path) -> list[Path]:
    return sorted(path for path in content_dir.rglob("*.md") if path.is_file())


HEADING_RE = re.compile(r"^#{1,6}\s+(.+?)\s*$", re.MULTILINE)


def is_external_link(target: str) -> bool:
    prefixes = ("http://", "https://", "mailto:", "//")
    return target.startswith(prefixes)


def normalize_local_target(source_file: Path, target: str) -> Path:
    clean_target = target.split("#", 1)[0].split("?", 1)[0].strip()
    return (source_file.parent / clean_target).resolve()


def make_anchor(text: str) -> str:
    text = text.strip().strip("`").lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    return re.sub(r"[\s-]+", "-", text).strip("-")


def extract_anchors(markdown: str) -> set[str]:
    anchors: set[str] = set()
    duplicate_counts: dict[str, int] = {}

    for heading in HEADING_RE.findall(markdown):
        base = make_anchor(heading)
        occurrence = duplicate_counts.get(base, 0)
        duplicate_counts[base] = occurrence + 1
        anchors.add(base if occurrence == 0 else f"{base}-{occurrence}")

    return anchors


def validate_links(
    content_dir: Path = CONTENT_DIR,
    root: Path = ROOT,
) -> list[str]:
    errors: list[str] = []

    for md_file in iter_markdown_files(content_dir):
        text = md_file.read_text(encoding="utf-8")

        for _, target in LINK_RE.findall(text):
            target = target.strip()
            if not target or is_external_link(target):
                continue

            resolved = normalize_local_target(md_file, target)
            rel_file = md_file.relative_to(root).as_posix()
            if not resolved.is_file():
                errors.append(f"{rel_file}: broken link -> {target}")
                continue

            fragment = ""
            if "#" in target:
                fragment = target.split("#", 1)[1].split("?", 1)[0].strip()
            if fragment:
                anchors = extract_anchors(resolved.read_text(encoding="utf-8"))
                if fragment.lower() not in anchors:
                    errors.append(f"{rel_file}: missing anchor -> {target}")

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
