from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"
GENERATED_DIR = ROOT / "generated"
OUTPUT_FILE = GENERATED_DIR / "index.json"

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$", re.MULTILINE)
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
QUESTION_RE = re.compile(r"^\s*(?:Q:|[-*]\s*Q:|##+\s*Q:)", re.MULTILINE)


def iter_markdown_files(content_dir: Path) -> list[Path]:
    return sorted(
        path for path in content_dir.rglob("*.md")
        if path.is_file()
    )


def extract_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            return stripped[2:].strip()
    return fallback


def extract_headings(text: str) -> list[str]:
    headings: list[str] = []
    for match in HEADING_RE.finditer(text):
        heading_text = match.group(2).strip()
        if heading_text:
            headings.append(heading_text)
    return headings


def extract_links(text: str) -> list[str]:
    links: list[str] = []
    for _, target in LINK_RE.findall(text):
        target = target.strip()
        if target:
            links.append(target)
    return links


def count_questions(text: str) -> int:
    return len(QUESTION_RE.findall(text))


def build_topic_record(md_file: Path) -> dict:
    relative_path = md_file.relative_to(ROOT).as_posix()
    section = md_file.relative_to(CONTENT_DIR).parts[0]
    stem = md_file.relative_to(CONTENT_DIR).with_suffix("").as_posix()

    text = md_file.read_text(encoding="utf-8")
    title = extract_title(text, md_file.stem)
    headings = extract_headings(text)
    links = extract_links(text)
    question_count = count_questions(text)

    return {
        "id": stem,
        "title": title,
        "section": section,
        "path": relative_path,
        "question_count": question_count,
        "headings": headings,
        "links": links,
    }


def build_index() -> list[dict]:
    return [build_topic_record(md_file) for md_file in iter_markdown_files(CONTENT_DIR)]


def main() -> None:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    index = build_index()

    OUTPUT_FILE.write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        )

    print(f"Indexed {len(index)} markdown files into {OUTPUT_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

    # python scripts/build_index.py