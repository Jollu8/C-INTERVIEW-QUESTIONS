from __future__ import annotations

import hashlib
import html
import json
import posixpath
import re
import textwrap
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit

from markdown_it import MarkdownIt

try:
    from scripts.validate_links import make_anchor
except ModuleNotFoundError:
    from validate_links import make_anchor

ROOT = Path(__file__).resolve().parents[1]
MARKDOWN = MarkdownIt("commonmark", {"html": False})
SECTION_NAMES = [
    "C/C++",
    "Алгоритмы и структуры данных",
    "Многопоточность",
    "Linux и системы",
    "Сети",
    "Инструменты разработки",
    "Тестирование",
    "Архитектура",
    "Базы данных",
    "Python",
    "Математика",
    "Архитектура компьютеров",
    "GPU и параллельные вычисления",
]


def parse_questions(source: str, path: str) -> list[dict]:
    tokens = MARKDOWN.parse(source)
    lines = source.splitlines()
    boundaries = sorted(
        {
            token.map[0]
            for token in tokens
            if token.map
            and (
                (token.type == "list_item_open" and token.level == 1)
                or (token.type == "heading_open" and token.level == 0)
                or (token.type == "hr" and token.level == 0)
            )
        }
    )
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
        body = textwrap.dedent("\n".join(lines[paragraph.map[1] : end])).strip()
        body = re.sub(r"(?m)^\[<- Prev\].*$", "", body).strip()
        context = ""
        if body.startswith("**Условие:**"):
            # A code exercise is visible before an answer is added or revealed.
            answer_line = next((
                item.map[0] for item in MARKDOWN.parse(body)
                if item.type == "inline" and item.map
                and re.match(r"^\*\*Ответ\s*:\*\*", item.content)
            ), None)
            if answer_line is None:
                context, body = body, ""
            else:
                body_lines = body.splitlines()
                context = "\n".join(body_lines[:answer_line]).strip()
                body = "\n".join(body_lines[answer_line:]).strip()
        has_answer = bool(re.search(r"\*\*Ответ\s*:\*\*", body))
        if not has_answer:
            # Code-review material uses an example followed by an error analysis.
            # Read paragraph tokens so labels inside a code fence cannot qualify.
            paragraphs = [
                token.content
                for token in MARKDOWN.parse(body)
                if token.type == "inline"
            ]
            has_answer = any(
                re.match(r"^(?:\*\*)?Пример\s*:", text)
                for text in paragraphs
            ) and any(
                re.match(r"^(?:\*\*)?Ошибка\s*:", text)
                for text in paragraphs
            )
        digest = hashlib.sha256(question.encode()).hexdigest()[:16]
        occurrences[digest] = occurrences.get(digest, 0) + 1
        questions.append(
            {
                "id": f"{path}:{digest}:{occurrences[digest]}",
                "question": MARKDOWN.render(question + "\n\n" + context),
                "answer": MARKDOWN.render(body) if has_answer else None,
                "group": heading.replace("_", " "),
                "line": start + 1,
            }
        )
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
            title = next(
                (line[2:] for line in source.splitlines() if line.startswith("# ")),
                file.stem,
            )
            title = re.sub(r"^\d+[_ .-]*", "", title).replace("_", " ")
            topics.append({"id": path, "title": title, "questions": questions})
        plan = directory / "README.md"
        index = int(directory.name.split("_", 1)[0]) - 1
        sections.append(
            {
                "id": directory.name, "title": SECTION_NAMES[index], "topics": topics,
                "plan": f"plans/{directory.name}.html" if plan.exists() else None,
            }
        )
    return {"sections": sections}


def write_web(catalog: dict, directory: Path) -> None:
    chunks = directory / "topics"
    chunks.mkdir(parents=True, exist_ok=True)
    for section in catalog["sections"]:
        for topic in section["topics"]:
            payload = json.dumps(
                topic["questions"], ensure_ascii=False, separators=(",", ":")
            )
            digest = hashlib.sha256(payload.encode()).hexdigest()[:16]
            topic["file"] = f"topics/{digest}.js"
            (directory / topic["file"]).write_text(
                "window.QUESTION_TOPICS = window.QUESTION_TOPICS || {};\n"
                + f"window.QUESTION_TOPICS[{json.dumps(topic['id'])}] = {payload};\n",
                encoding="utf-8",
            )
            # Keep stable IDs and answer flags for filters and saved progress.
            topic["questions"] = [
                {
                    "id": q["id"].removeprefix(topic["id"] + ":"),
                    "answer": bool(q["answer"]),
                }
                for q in topic["questions"]
            ]
    (directory / "data.js").write_text(
        "window.QUESTION_CATALOG = "
        + json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )


def version_assets(directory: Path) -> None:
    index = directory / "index.html"
    source = index.read_text(encoding="utf-8")
    for name in ("data.js", "app.js", "style.css"):
        digest = hashlib.sha256((directory / name).read_bytes()).hexdigest()[:16]
        source = re.sub(
            rf'((?:src|href)="){re.escape(name)}(?:\?v=[a-f0-9]+)?"',
            lambda m: m.group(1) + name + "?v=" + digest + '"',
            source,
        )
    index.write_text(source, encoding="utf-8")


def write_learning_pages(directory: Path, catalog: dict | None = None) -> None:
    renderer = MarkdownIt("commonmark", {"html": False}).enable("table")
    if catalog is None:
        catalog = build_catalog()
    topic_ids = {t["id"] for s in catalog["sections"] for t in s["topics"]}
    sources = sorted((ROOT / "content").rglob("*.md"))
    destinations = {
        path: (
            f"plans/{path.parent.name}.html" if path.name == "README.md"
            else "materials/" + path.relative_to(ROOT / "content").with_suffix(
                ".html"
            ).as_posix()
        )
        for path in sources if path.relative_to(ROOT).as_posix() not in topic_ids
        or path.name == "README.md"
    }

    def page(
        source: str, back: str, prefix: str, origin: Path | None = None,
        destination: str = "roadmap.html",
    ) -> str:
        title = source.splitlines()[0].removeprefix("# ")
        tokens = renderer.parse(source)
        anchors: dict[str, int] = {}
        headers: list[str] = []
        column = 0
        table_roles = {
            "table_open": "table", "thead_open": "rowgroup",
            "tbody_open": "rowgroup", "tr_open": "row",
            "th_open": "columnheader", "td_open": "cell",
        }
        for index, token in enumerate(tokens):
            if token.type == "heading_open":
                base = make_anchor(tokens[index + 1].content)
                occurrence = anchors.get(base, 0)
                anchors[base] = occurrence + 1
                token.attrSet("id", base if occurrence == 0 else f"{base}-{occurrence}")
            # Explicit roles retain table navigation when the mobile layout
            # changes the native table elements to stacked blocks.
            if token.type in table_roles:
                token.attrSet("role", table_roles[token.type])
            if token.type == "table_open":
                headers = []
            elif token.type == "tr_open":
                column = 0
            elif token.type == "th_open":
                token.attrSet("scope", "col")
                # Inline tokens retain readable header text without Markdown
                # markers, so mobile cell labels also work with links or code.
                inline = tokens[index + 1]
                headers.append("".join(
                    child.content
                    for child in inline.children or []
                    if child.type in {"text", "code_inline", "image"}
                ).strip())
            elif token.type == "td_open":
                if column < len(headers):
                    token.attrSet("data-label", headers[column])
                column += 1
        if origin:
            for token in tokens:
                for child in token.children or []:
                    if child.type != "link_open":
                        continue
                    href = child.attrGet("href") or ""
                    url = urlsplit(href)
                    if url.scheme or url.netloc or not url.path:
                        continue
                    target = (origin.parent / unquote(url.path)).resolve()
                    if target == ROOT / "generate_plane_5.md":
                        link = posixpath.relpath(
                            "roadmap.html", posixpath.dirname(destination)
                        )
                        if url.fragment:
                            link += "#" + url.fragment
                        child.attrSet("href", link)
                        continue
                    if (
                        target.suffix != ".md"
                        or not target.is_relative_to(ROOT / "content")
                    ):
                        continue
                    topic_id = target.relative_to(ROOT).as_posix()
                    parent = posixpath.dirname(destination)
                    if topic_id in topic_ids:
                        link = posixpath.relpath("index.html", parent)
                        link += "?topic=" + quote(topic_id, safe="/")
                    elif target in destinations:
                        link = posixpath.relpath(destinations[target], parent)
                        if url.fragment:
                            link += "#" + url.fragment
                    else:
                        raise ValueError(f"Missing learning material: {target}")
                    child.attrSet("href", link)
        return (
            '<!doctype html><html lang="ru"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width, '
            'initial-scale=1, viewport-fit=cover">'
            f'<title>{html.escape(title)}</title>'
            f'<link rel="stylesheet" href="{prefix}style.css"></head><body>'
            f'<main class="learning-page"><a href="{back}">← К тренировкам</a>'
            + renderer.renderer.render(tokens, renderer.options, {})
            + '</main></body></html>\n'
        )

    roadmap = ROOT / "generate_plane_5.md"
    source = roadmap.read_text(encoding="utf-8")
    (directory / "roadmap.html").write_text(
        page(source, "index.html", "", roadmap), encoding="utf-8"
    )
    for path, destination in destinations.items():
        source = path.read_text(encoding="utf-8")
        output = directory / destination
        output.parent.mkdir(parents=True, exist_ok=True)
        prefix = posixpath.relpath(".", posixpath.dirname(destination)) + "/"
        output.write_text(
            page(source, prefix + "index.html", prefix, path, destination),
            encoding="utf-8",
        )


def main() -> None:
    catalog = build_catalog()
    write_web(catalog, ROOT / "web")
    write_learning_pages(ROOT / "web", catalog)
    version_assets(ROOT / "web")
    count = sum(len(t["questions"]) for s in catalog["sections"] for t in s["topics"])
    print(f"Built web/data.js: {count} questions")


if __name__ == "__main__":
    main()
