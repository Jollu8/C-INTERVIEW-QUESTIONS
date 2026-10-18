from pathlib import Path

from scripts.build_web import build_catalog, parse_questions

ROOT = Path(__file__).resolve().parents[1]
REVIEW_PATH = "content/03_concurrency/02_review_code.md"


def test_code_review_preserves_example_and_error_analysis() -> None:
    source = (
        "# Review\n\n1. Is this flag safe?\n\n"
        "   Пример:\n\n   ```cpp\n   bool stop = false;\n   ```\n\n"
        "   Ошибка: data race without synchronization.\n\n"
        "2. Another question?\n"
    )
    questions = parse_questions(source, REVIEW_PATH)
    assert len(questions) == 2
    assert "bool stop = false;" in questions[0]["answer"]
    assert "data race" in questions[0]["answer"]
    assert "language-cpp" in questions[0]["answer"]
    assert questions[1]["answer"] is None


def test_example_alone_and_labels_in_code_do_not_become_answers() -> None:
    source = (
        "1. Example without explanation?\n\n"
        "   Пример:\n\n   ```cpp\n   int value = 0;\n   ```\n\n"
        "2. Labels inside a code sample?\n\n"
        "   ```text\n   Пример:\n   Ошибка: sample text\n   ```\n"
    )
    assert all(q["answer"] is None for q in parse_questions(source, REVIEW_PATH))


def test_review_topic_is_named_and_all_material_is_available() -> None:
    questions = parse_questions((ROOT / REVIEW_PATH).read_text(), REVIEW_PATH)
    assert len(questions) == 110
    assert all(q["answer"] for q in questions)
    assert "scheduler.schedule()" in questions[99]["answer"]
    assert "language-cpp" in questions[99]["answer"]
    topics = [
        topic
        for section in build_catalog()["sections"]
        for topic in section["topics"]
        if topic["id"] == REVIEW_PATH
    ]
    assert len(topics) == 1
    assert topics[0]["title"] == "Concurrency: разбор кода для Senior C++"


def test_section_separator_does_not_turn_review_into_indented_code() -> None:
    source = (
        "15. Review at end of section?\n\n"
        "       Пример:\n\n       ```cpp\n       int value = 0;\n       ```\n\n"
        "       Ошибка: missing synchronization.\n\n"
        "   ---\n\n## Next section\n"
    )
    questions = parse_questions(source, REVIEW_PATH)
    assert len(questions) == 1
    assert questions[0]["answer"]
    assert "language-cpp" in questions[0]["answer"]
    assert "missing synchronization" in questions[0]["answer"]
