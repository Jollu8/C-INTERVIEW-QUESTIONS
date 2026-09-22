from scripts.build_pages import package_pages
from scripts.build_web import parse_questions
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_answer_code_and_nested_lists_stay_in_question() -> None:
    questions = parse_questions(
        "# Basics\n\n## Easy\n\n1. First question?\n\n"
        "   **Ответ:** Explanation.\n\n"
        "   1. Nested item\n   2. Another item\n\n"
        "   ```cpp\n   auto f = [x](int y) { return y; };\n   ```\n\n"
        "2. Second question?\n", "content/example.md",
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
    assert "ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']" in app


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
        "21. Another?\n\n    **Ответ:** Another answer.\n", "example.md",
    )
    assert len(questions) == 2
    assert "Present" in questions[0]["answer"]
    assert "Another answer" not in questions[0]["answer"]


def test_pages_package_preserves_relative_paths(tmp_path) -> None:
    package_pages(tmp_path)
    assert 'url=web/' in (tmp_path / "index.html").read_text()
    for name in ("index.html", "app.js", "style.css", "data.js"):
        assert (tmp_path / "web" / name).is_file()
    assert (tmp_path / "content/01_cpp/01_base.md").is_file()
    assert (tmp_path / ".nojekyll").is_file()
