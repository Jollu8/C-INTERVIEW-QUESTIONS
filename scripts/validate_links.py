from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^[ \t]*(`{3,}|~{3,})(.*)$")


def strip_fenced_code(markdown: str) -> str:
    lines: list[str] = []
    fence = ""
    for line in markdown.splitlines(keepends=True):
        match = FENCE_RE.match(line)
        if fence:
            if (
                match
                and match[1][0] == fence[0]
                and len(match[1]) >= len(fence)
                and not match[2].strip()
            ):
                fence = ""
            lines.append("\n")
        elif match:
            fence = match[1]
            lines.append("\n")
        else:
            lines.append(line)
    return "".join(lines)


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
        text = strip_fenced_code(md_file.read_text(encoding="utf-8"))

        for match in LINK_RE.finditer(text):
            target = match[2].strip()
            if not target or is_external_link(target):
                continue

            resolved = normalize_local_target(md_file, target)
            rel_file = md_file.relative_to(root).as_posix()
            line = text.count("\n", 0, match.start()) + 1
            location = f"{rel_file}:{line}"
            try:
                target_file = resolved.relative_to(root.resolve()).as_posix()
            except ValueError:
                target_file = str(resolved)
            details = (
                f"\n   Link: {match[0]}"
                f"\n   Resolved file: {target_file}"
            )
            if not resolved.is_file():
                errors.append(
                    f"{location}: broken link (target file not found)" + details
                )
                continue

            fragment = ""
            if "#" in target:
                fragment = target.split("#", 1)[1].split("?", 1)[0].strip()
            if fragment:
                anchors = extract_anchors(resolved.read_text(encoding="utf-8"))
                if fragment.lower() not in anchors:
                    errors.append(
                        f"{location}: missing anchor '#{fragment}' in target file"
                        + details
                    )

    return errors


def main() -> None:
    errors = validate_links()

    if errors:
        print(f"Broken links found ({len(errors)}):")
        for error in errors:
            print(f" - {error}")
        sys.exit(1)

    print("All local markdown links are valid.")


if __name__ == "__main__":
    main()
