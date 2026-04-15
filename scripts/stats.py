from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIR = ROOT / "generated"
INDEX_FILE = GENERATED_DIR / "index.json"
STATS_FILE = GENERATED_DIR / "stats.json"


def load_index() -> list[dict]:
    if not INDEX_FILE.exists():
        return []

    data = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("generated/index.json must contain a JSON array")
    return data


def build_stats(index: list[dict]) -> dict:
    section_counter = Counter()
    total_questions = 0
    total_links = 0

    for item in index:
        section = item.get("section", "unknown")
        section_counter[section] += 1
        total_questions += int(item.get("question_count", 0))
        total_links += len(item.get("links", []))

    return {
        "total_topics": len(index),
        "total_questions": total_questions,
        "total_links": total_links,
        "sections": dict(sorted(section_counter.items())),
    }


def main() -> None:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    index = load_index()
    stats = build_stats(index)

    STATS_FILE.write_text(
        json.dumps(stats, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        )

    print(f"Wrote stats to {STATS_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

# python scripts/build_index.py
# python scripts/stats.py