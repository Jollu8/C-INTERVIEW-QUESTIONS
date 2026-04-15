import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_FILE = ROOT / "generated" / "index.json"

REQUIRED_FIELDS = {
    "id": str,
    "title": str,
    "section": str,
    "path": str,
    "question_count": int,
    "headings": list,
    "links": list,
}


def load_index() -> list[dict]:
    data = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    assert isinstance(data, list), "generated/index.json must contain a JSON array"
    return data


def test_index_entries_have_required_fields_and_types() -> None:
    index = load_index()

    for i, item in enumerate(index):
        assert isinstance(item, dict), f"Entry #{i} must be an object"

        for field, expected_type in REQUIRED_FIELDS.items():
            assert field in item, f"Entry #{i} is missing required field '{field}'"
            assert isinstance(
                item[field], expected_type
            ), f"Entry #{i}: field '{field}' must be {expected_type.__name__}"


def test_index_paths_exist() -> None:
    index = load_index()

    for i, item in enumerate(index):
        path = ROOT / item["path"]
        assert path.exists(), f"Entry #{i}: referenced path does not exist -> {item['path']}"


def test_question_count_is_non_negative() -> None:
    index = load_index()

    for i, item in enumerate(index):
        assert item["question_count"] >= 0, f"Entry #{i}: question_count must be >= 0"


def test_headings_and_links_contain_strings() -> None:
    index = load_index()

    for i, item in enumerate(index):
        for j, heading in enumerate(item["headings"]):
            assert isinstance(
                heading, str
            ), f"Entry #{i}: headings[{j}] must be a string"

        for j, link in enumerate(item["links"]):
            assert isinstance(
                link, str
            ), f"Entry #{i}: links[{j}] must be a string"
