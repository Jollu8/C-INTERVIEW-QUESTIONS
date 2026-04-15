import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_FILE = ROOT / "generated" / "index.json"


def load_index() -> list[dict]:
    data = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    assert isinstance(data, list), "generated/index.json must contain a JSON array"
    return data


def test_index_ids_are_unique() -> None:
    index = load_index()
    ids = [item["id"] for item in index if isinstance(item, dict) and "id" in item]
    assert len(ids) == len(set(ids)), "Duplicate topic ids found in generated/index.json"


def test_index_ids_are_non_empty_strings() -> None:
    index = load_index()

    for item in index:
        assert isinstance(item, dict), "Each index entry must be an object"
        assert "id" in item, "Each index entry must have an 'id'"
        assert isinstance(item["id"], str), "'id' must be a string"
        assert item["id"].strip(), "'id' must not be empty"
