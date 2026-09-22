from pathlib import Path

from scripts.build_pages import package_pages
from scripts.build_web import parse_questions

ROOT = Path(__file__).resolve().parents[1]


def test_answer_code_and_nested_lists_stay_in_question() -> None:
    questions = parse_questions(
        "# Basics\n\n## Easy\n\n1. First question?\n\n"
        "   **Ответ:** Explanation.\n\n"
        "   1. Nested item\n   2. Another item\n\n"
        "   ```cpp\n   auto f = [x](int y) { return y; };\n   ```\n\n"
        "2. Second question?\n",
        "content/example.md",
    )
    assert len(questions) == 2
    assert "<pre><code" in questions[0]["answer"]
    assert "Nested item" in questions[0]["answer"]
    assert questions[0]["group"] == "Easy"
    assert questions[1]["answer"] is None


def test_stable_ids_when_numbering_changes() -> None:
    before = parse_questions("1. Existing?\n", "example.md")
    after = parse_questions("1. Added?\n2. Existing?\n", "example.md")
    assert before[0]["id"] == after[1]["id"]


def test_readme_navigation_and_topic_plans_are_not_questions() -> None:
    assert parse_questions("1. [Basics](./basic.md)\n", "README.md") == []
    assert parse_questions("1. Variables\n2. Functions\n", "README.md") == []
    assert len(parse_questions("1. What is sorting?\n", "README.md")) == 1


def test_html_in_content_is_escaped() -> None:
    questions = parse_questions(
        '1. <script>alert(1)</script>?\n\n   **Ответ:** <img onerror="bad()">',
        "example.md",
    )
    assert "<script>" not in questions[0]["question"]
    assert "<img " not in questions[0]["answer"]


def test_web_loads_and_runs_math_renderer() -> None:
    index = (ROOT / "web/index.html").read_text(encoding="utf-8")
    app = (ROOT / "web/app.js").read_text(encoding="utf-8")
    assert "katex.min.css" in index
    assert "katex.min.js" in index
    assert "auto-render.min.js" in index
    assert "renderMath(root)" in app
    assert (
        "ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']" in app
    )


def test_web_loads_and_runs_code_highlighter() -> None:
    index = (ROOT / "web/index.html").read_text(encoding="utf-8")
    app = (ROOT / "web/app.js").read_text(encoding="utf-8")
    assert "highlightjs/cdn-release" in index
    assert "highlight.min.js" in index
    assert "highlightCode(root)" in app
    assert "window.hljs.highlightElement(block)" in app


def test_under_indented_answer_is_preserved() -> None:
    questions = parse_questions(
        "20. Question?\n\n   **Ответ:** Present.\n\n"
        "21. Another?\n\n    **Ответ:** Another answer.\n",
        "example.md",
    )
    assert len(questions) == 2
    assert "Present" in questions[0]["answer"]
    assert "Another answer" not in questions[0]["answer"]


def test_pages_package_preserves_relative_paths(tmp_path) -> None:
    package_pages(tmp_path)
    assert "url=web/" in (tmp_path / "index.html").read_text()
    for name in ("index.html", "app.js", "style.css", "data.js"):
        assert (tmp_path / "web" / name).is_file()
    assert (tmp_path / "content/01_cpp/01_base.md").is_file()
    assert (tmp_path / ".nojekyll").is_file()


def test_split_catalog_preserves_questions_and_answer_flags(tmp_path) -> None:
    import json

    from scripts.build_web import write_web

    original = parse_questions(
        "1. First?\n\n   **Ответ:** Example.\n\n"
        "   ```cpp\n   int x = 1;\n   ```\n\n2. Second?\n",
        "content/example.md",
    )
    catalog = {
        "sections": [{"topics": [{"id": "content/example.md", "questions": original}]}]
    }
    write_web(catalog, tmp_path)
    topic = catalog["sections"][0]["topics"][0]
    assert [q["answer"] for q in topic["questions"]] == [True, False]
    assert [topic["id"] + ":" + q["id"] for q in topic["questions"]] == [
        q["id"] for q in original
    ]
    chunk = (tmp_path / topic["file"]).read_text()
    restored = json.loads(chunk.split(" = ", 2)[2].removesuffix(";\n"))
    assert restored == original
    assert "int x" not in (tmp_path / "data.js").read_text()
    previous_file = topic["file"]
    original[0]["answer"] += "Changed"
    write_web(
        {"sections": [{"topics": [{"id": topic["id"], "questions": original}]}]},
        tmp_path,
    )
    assert (tmp_path / previous_file).exists()


def test_external_renderers_do_not_block_startup() -> None:
    from html.parser import HTMLParser

    class StartupParser(HTMLParser):
        in_template = False
        startup_scripts = []
        startup_styles = []

        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            if tag == "template":
                self.in_template = True
            if not self.in_template and tag == "script":
                self.startup_scripts.append(attrs.get("src", "").split("?")[0])
            if not self.in_template and tag == "link":
                self.startup_styles.append(attrs.get("href", "").split("?")[0])

        def handle_endtag(self, tag):
            if tag == "template":
                self.in_template = False

    parser = StartupParser()
    parser.feed((ROOT / "web/index.html").read_text())
    assert parser.startup_scripts == ["data.js", "app.js"]
    assert parser.startup_styles == ["style.css"]


def test_asset_versions_follow_content(tmp_path) -> None:
    from scripts.build_web import version_assets

    (tmp_path / "index.html").write_text(
        '<script src="app.js"></script>'
        '<script src="data.js"></script><link href="style.css">'
    )
    for name in ("app.js", "data.js", "style.css"):
        (tmp_path / name).write_text(name)
    version_assets(tmp_path)
    first = (tmp_path / "index.html").read_text()
    version_assets(tmp_path)
    assert (tmp_path / "index.html").read_text() == first
    (tmp_path / "app.js").write_text("changed")
    version_assets(tmp_path)
    second = (tmp_path / "index.html").read_text()
    assert second != first
    assert second.split("</script>", 1)[1] == first.split("</script>", 1)[1]
