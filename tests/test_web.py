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


def test_updated_topics_keep_answers_inside_questions() -> None:
    topics = {
        'content/01_cpp/14_macro_and_build.md': 260,
        'content/01_cpp/15_performance.md': 250,
        'content/03_concurrency/01_base.md': 100,
        'content/04_system_linux/01_operating_systems.md': 180,
        'content/05_networking/01_osi_and_tcp_ip.md': 74,
        'content/06_tools_build_debug/01_build.md': 121,
    }
    for path, expected in topics.items():
        questions = parse_questions((ROOT / path).read_text(), path)
        assert len(questions) == expected, path
        for question in questions:
            assert '<strong>Ответ:' not in question['question'], path
        if 'operating_systems' not in path:
            assert all(question['answer'] for question in questions), path


def test_new_material_is_available_with_complete_answers() -> None:
    from scripts.build_web import MARKDOWN

    topics = {
        "content/01_cpp/16_best_practices.md": (200, 200),
        "content/02_algorithms_and_ds/README.md": (360, 360),
        "content/03_concurrency/02_review_code.md": (110, 110),
        "content/04_system_linux/01_operating_systems.md": (180, 180),
        "content/01_cpp/04_memory.md": (250, 250),
        "content/04_system_linux/02_linux_basic.md": (290, 290),
        "content/04_system_linux/03_processes_and_resource_management.md": (240, 240),
        "content/04_system_linux/04_filesystem_and_storage.md": (280, 280),
        "content/04_system_linux/05_linux_networking.md": (370, 370),
        "content/04_system_linux/06_sequrity.md": (100, 100),
        "content/04_system_linux/07_administration_and_devops.md": (280, 280),
        "content/04_system_linux/08_advanced.md": (230, 230),
        "content/05_networking/02_core_networking.md": (535, 535),
        "content/05_networking/03_transport_layer.md": (655, 655),
        "content/05_networking/04_wireless_fundamentals.md": (550, 550),
        "content/05_networking/05_lte.md": (810, 810),
        "content/05_networking/06_nr.md": (680, 680),
        "content/05_networking/07_network_security.md": (745, 745),
        "content/05_networking/08_troubleshooting_and_practice.md": (625, 625),
        "content/05_networking/09_3gpp_l2_lte_nr.md": (160, 160),
        "content/06_tools_build_debug/01_build.md": (121, 121),
        "content/06_tools_build_debug/02_toolchain.md": (119, 119),
        "content/06_tools_build_debug/03_debugging.md": (220, 220),
        "content/06_tools_build_debug/04_performance.md": (270, 270),
        "content/06_tools_build_debug/05_runtime.md": (260, 260),
        "content/06_tools_build_debug/06_ci.md": (260, 260),
        "content/06_tools_build_debug/07_type_questions.md": (105, 105),
        "content/06_tools_build_debug/08_advanced_topic.md": (160, 160),
    }
    for path, (total, answered) in topics.items():
        source = (ROOT / path).read_text()
        questions = parse_questions(source, path)
        assert len(questions) == total, path
        assert sum(bool(q["answer"]) for q in questions) == answered, path
        assert all("<strong>Ответ:" not in q["question"] for q in questions), path
        if path.startswith("content/06_tools_build_debug/"):
            assert all(
                "<strong>Источник:</strong>" in q["answer"]
                for q in questions
            ), path
        for token in MARKDOWN.parse(source):
            if token.type == "fence":
                assert "**Ответ:**" not in token.content, (path, token.map)


def test_testing_quality_topics_have_complete_answers_and_correct_topics() -> None:
    from scripts.build_web import MARKDOWN

    expected = {
        "01_base.md": 76,
        "02_unit_test.md": 29,
        "03_integration_test.md": 29,
        "04_e2e_test.md": 29,
        "05_api_test.md": 33,
        "06_performance_test.md": 31,
        "07_security_test.md": 31,
        "08_automation_test.md": 33,
        "09_qa_base.md": 27,
        "10_qa_management_test.md": 30,
        "11_qa_bug_tracking.md": 31,
        "12_qa_code_qualaty.md": 31,
        "13_qa_ci_cd.md": 31,
        "14_qa_documentation.md": 31,
        "15_qa_agile.md": 31,
        "16_test_architecture.md": 31,
        "17_observabilty_and_monitorung.md": 32,
        "18_test_ai.md": 32,
    }
    directory = ROOT / "content/07_testing_and_quality"
    for name, count in expected.items():
        path = directory / name
        source = path.read_text()
        questions = parse_questions(source, path.relative_to(ROOT).as_posix())
        assert len(questions) == count, name
        assert "contentReference" not in source, name
        for question in questions:
            assert "<strong>Ответ:" not in question["question"], name
            assert question["answer"], (name, question["line"])
            assert "<strong>Источник:</strong>" in question["answer"], name
            assert "**Ответ:**" not in question["answer"], name
        for token in MARKDOWN.parse(source):
            if token.type == "fence":
                assert "**Ответ:**" not in token.content, (name, token.map)
    assert sum(expected.values()) == 598
    assert (directory / "17_observabilty_and_monitorung.md").read_text().startswith(
        "# Observability & Monitoring\n"
    )
    assert (directory / "18_test_ai.md").read_text().startswith(
        "# AI в тестировании\n"
    )


def test_index_uses_web_question_boundaries() -> None:
    from scripts.build_index import count_questions

    source = (
        "# Navigation\n\n1. [Topic](topic.md)\n\n"
        "2. Real question?\n\n   **Ответ:** Explanation\n\n"
        "   1. Nested explanation\n\n"
        "   ```text\n   1. Code is not a question\n   ```\n"
    )
    assert count_questions(source, "README.md") == 1
    assert count_questions(source, "README.md") == len(
        parse_questions(source, "README.md")
    )


def test_learning_pages_render_tables_and_preserve_local_links(tmp_path) -> None:
    from html.parser import HTMLParser
    from urllib.parse import parse_qs, unquote, urlsplit

    from scripts.build_web import build_catalog, write_learning_pages

    catalog = build_catalog()
    topic_ids = {t["id"] for s in catalog["sections"] for t in s["topics"]}
    write_learning_pages(tmp_path, catalog)
    roadmap = (tmp_path / "roadmap.html").read_text()
    assert "<table>" in roadmap
    assert "index.html?track=systems" in roadmap
    assert '<html lang="ru">' in roadmap

    class Links(HTMLParser):
        def __init__(self):
            super().__init__()
            self.targets = []

        def handle_starttag(self, tag, attrs):
            if tag == "a":
                self.targets.append(dict(attrs).get("href", ""))

    pages = list((tmp_path / "plans").glob("*.html"))
    pages += list((tmp_path / "materials").rglob("*.html"))
    for plan in pages:
        links = Links()
        links.feed(plan.read_text())
        for target in links.targets:
            url = urlsplit(target)
            if url.scheme or url.netloc or not url.path:
                continue
            assert not url.path.endswith(".md"), (plan, target)
            if url.path.endswith("index.html"):
                topic = parse_qs(url.query).get("topic")
                if topic:
                    assert topic[0] in topic_ids, (plan, target)
            else:
                assert (plan.parent / unquote(url.path)).is_file(), (plan, target)
    cpp = (tmp_path / "plans/01_cpp.html").read_text()
    assert "../index.html?topic=content/01_cpp/01_base.md" in cpp
    resources = tmp_path / "materials/07_testing_and_quality/19_resources.html"
    assert resources.is_file()
    assert "<h1>" in resources.read_text()


def test_statistics_include_answer_coverage() -> None:
    from scripts.stats import build_stats

    stats = build_stats([
        {"section": "cpp", "question_count": 3, "answer_count": 2},
        {"section": "plans", "question_count": 0, "answer_count": 0},
    ])
    assert stats["total_questions"] == 3
    assert stats["total_answers"] == 2


def test_exercise_context_is_visible_and_answer_is_separate() -> None:
    source = (
        '1. What happens?\n\n   **Условие:**\n\n'
        '   ```python\n   print("**Ответ:** is only a string")\n   ```\n'
    )
    unanswered = parse_questions(source, 'exercise.md')[0]
    answered = parse_questions(
        source + '\n   **Ответ:** Explanation, not part of the condition.\n',
        'exercise.md',
    )[0]
    assert unanswered['answer'] is None
    assert '<pre><code class="language-python">' in unanswered['question']
    assert 'print(' in unanswered['question']
    assert answered['id'] == unanswered['id']
    assert answered['question'] == unanswered['question']
    assert 'Explanation' not in answered['question']
    assert 'Explanation' in answered['answer']
    assert 'print(' not in answered['answer']


def test_python_questions_include_code_and_no_unwritten_answers() -> None:
    import ast

    from scripts.build_web import MARKDOWN

    paths = sorted((ROOT / 'content/10_python').glob('[0-9]*.md'))
    assert len(paths) == 13
    all_ids = set()
    total = 0
    for index, path in enumerate(paths):
        source = path.read_text()
        questions = parse_questions(source, path.relative_to(ROOT).as_posix())
        assert len(questions) == (35 if index < 9 else 20), path
        assert all(q['answer'] is None for q in questions), path
        exercises = [q for q in questions if q['group'] == 'Разбор кода']
        assert len(exercises) == 5, path
        assert all('<pre><code' in q['question'] for q in exercises), path
        for token in MARKDOWN.parse(source):
            if token.type == 'fence' and token.info == 'python':
                ast.parse(token.content, filename=str(path))
        for question in questions:
            assert question['id'] not in all_ids, path
            all_ids.add(question['id'])
        total += len(questions)
    assert total == 395
