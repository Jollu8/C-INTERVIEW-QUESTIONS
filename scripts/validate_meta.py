from __future__ import annotations

import json
import sys
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
    if not INDEX_FILE.exists():
        raise FileNotFoundError(f"Missing file: {INDEX_FILE}")

    data = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("generated/index.json must contain a JSON array")

    return data


def validate_record(item: dict, seen_ids: set[str], index: int) -> list[str]:
    errors: list[str] = []

    if not isinstance(item, dict):
        return [f"Entry #{index} is not an object"]

    for field, expected_type in REQUIRED_FIELDS.items():
        if field not in item:
            errors.append(f"Entry #{index}: missing required field '{field}'")
            continue

        value = item[field]
        if not isinstance(value, expected_type):
            errors.append(
                f"Entry #{index}: field '{field}' must be of type "
                f"{expected_type.__name__}"
            )

    item_id = item.get("id")
    if isinstance(item_id, str):
        if not item_id.strip():
            errors.append(f"Entry #{index}: 'id' must not be empty")
        elif item_id in seen_ids:
            errors.append(f"Entry #{index}: duplicate id '{item_id}'")
        else:
            seen_ids.add(item_id)

    path_value = item.get("path")
    if isinstance(path_value, str) and path_value.strip():
        file_path = ROOT / path_value
        if not file_path.exists():
            errors.append(f"Entry #{index}: path does not exist -> {path_value}")

    headings = item.get("headings")
    if isinstance(headings, list):
        for i, heading in enumerate(headings):
            if not isinstance(heading, str) or not heading.strip():
                errors.append(
                    f"Entry #{index}: headings[{i}] must be a non-empty string"
                )

    links = item.get("links")
    if isinstance(links, list):
        for i, link in enumerate(links):
            if not isinstance(link, str) or not link.strip():
                errors.append(
                    f"Entry #{index}: links[{i}] must be a non-empty string"
                )

    question_count = item.get("question_count")
    if isinstance(question_count, int) and question_count < 0:
        errors.append(f"Entry #{index}: question_count must be >= 0")

    return errors


def main() -> None:
    try:
        index = load_index()
    except Exception as exc:
        print(f"Validation failed: {exc}")
        sys.exit(1)

    seen_ids: set[str] = set()
    errors: list[str] = []

    for idx, item in enumerate(index):
        errors.extend(validate_record(item, seen_ids, idx))

    if errors:
        print("Metadata validation failed:")
        for error in errors:
            print(f" - {error}")
        sys.exit(1)

    print("Metadata validation passed.")


if __name__ == "__main__":
    main()