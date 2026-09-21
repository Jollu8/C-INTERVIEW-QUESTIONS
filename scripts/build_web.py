from __future__ import annotations

import hashlib
import json
import re
import textwrap
from pathlib import Path

from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[1]
MARKDOWN = MarkdownIt("commonmark", {"html": False})
SECTION_NAMES = [
    "C/C++", "Алгоритмы и структуры данных", "Многопоточность",
    "Linux и системы", "Сети", "Инструменты разработки", "Тестирование",
    "Архитектура", "Базы данных", "Python",
]


def parse_questions(source: str, path: str) -> list[dict]:
    tokens = MARKDOWN.parse(source)
    lines = source.splitlines()
    boundaries = sorted({
        token.map[0] for token in tokens if token.map and (
            (token.type == "list_item_open" and token.level == 1)
            or (token.type == "heading_open" and token.level == 0)
        )
    })
    questions = []
    heading = ""
    occurrences: dict[str, int] = {}
    for i, token in enumerate(tokens):
        if token.type == "heading_open" and token.level == 0:
            heading = tokens[i + 1].content
        if token.type != "list_item_open" or token.level != 1:
            continue
        if token.markup not in (".", ")") or not token.map:
            continue
        paragraph = tokens[i + 2]
        if paragraph.type != "inline" or not paragraph.map:
            continue
        question = paragraph.content
        if re.fullmatch(r"\[.*\]\(.*\)", question):
            continue
        if path.endswith("README.md") and "?" not in question:
            continue
        start, end = token.map
        # Some answers are under-indented and fall outside the Markdown list item.
        end = next((line for line in boundaries if line > start), len(lines))
        body = textwrap.dedent("\n".join(lines[paragraph.map[1]:end])).strip()
        body = re.sub(r"(?m)^\[<- Prev\].*$", "", body).strip()
        has_answer = bool(re.search(r"\*\*Ответ\s*:\*\*", body))
        digest = hashlib.sha256(question.encode()).hexdigest()[:16]
        occurrences[digest] = occurrences.get(digest, 0) + 1
        questions.append({
            "id": f"{path}:{digest}:{occurrences[digest]}",
            "question": MARKDOWN.render(question),
            "answer": MARKDOWN.render(body) if has_answer else None,
            "group": heading.replace("_", " "),
            "line": start + 1,
        })
    return questions


def build_catalog() -> dict:
    sections = []
    for directory in sorted((ROOT / "content").iterdir()):
        if not directory.is_dir():
            continue
        topics = []
        for file in sorted(directory.glob("*.md")):
            source = file.read_text(encoding="utf-8")
            path = file.relative_to(ROOT).as_posix()
            questions = parse_questions(source, path)
            if not questions:
                continue
            title = next((line[2:] for line in source.splitlines()
                          if line.startswith("# ")), file.stem)
            title = re.sub(r"^\d+[_ .-]*", "", title).replace("_", " ")
            topics.append({"id": path, "title": title, "questions": questions})
        index = int(directory.name.split("_", 1)[0]) - 1
        sections.append({"id": directory.name, "title": SECTION_NAMES[index],
                         "topics": topics})
    return {"sections": sections}


def main() -> None:
    catalog = build_catalog()
    output = ROOT / "web" / "data.js"
    output.write_text("window.QUESTION_CATALOG = " + json.dumps(
        catalog, ensure_ascii=False, separators=(",", ":")
    ) + ";\n", encoding="utf-8")
    count = sum(len(t["questions"]) for s in catalog["sections"] for t in s["topics"])
    print(f"Built web/data.js: {count} questions")


if __name__ == "__main__":
    main()
