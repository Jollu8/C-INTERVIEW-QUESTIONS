from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_required_directories_exist() -> None:
    required_dirs = [
        "content",
        "generated",
        "schemas",
        "scripts",
        "templates",
        "tests",
    ]

    for rel_path in required_dirs:
        path = ROOT / rel_path
        assert path.exists(), f"Missing directory: {rel_path}"
        assert path.is_dir(), f"Expected directory: {rel_path}"


def test_required_core_files_exist() -> None:
    required_files = [
        "README.md",
        "LICENSE",
        "CONTRIBUTING.md",
        "generated/index.json",
        "generated/stats.json",
        "schemas/topic.schema.json",
        "scripts/build_index.py",
        "scripts/stats.py",
        "scripts/validate_links.py",
        "scripts/validate_meta.py",
    ]

    for rel_path in required_files:
        path = ROOT / rel_path
        assert path.exists(), f"Missing file: {rel_path}"
        assert path.is_file(), f"Expected file: {rel_path}"


def test_content_has_sections() -> None:
    content_dir = ROOT / "content"
    sections = [p for p in content_dir.iterdir() if p.is_dir()]
    assert sections, "content/ must contain at least one section directory"
