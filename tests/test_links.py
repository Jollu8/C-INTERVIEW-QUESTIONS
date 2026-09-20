import re
from pathlib import Path

from scripts.validate_links import validate_links

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content"
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def iter_markdown_files() -> list[Path]:
    return sorted(path for path in CONTENT_DIR.rglob("*.md") if path.is_file())


def is_external_link(target: str) -> bool:
    return target.startswith(("http://", "https://", "mailto:", "#"))


def resolve_local_link(source_file: Path, target: str) -> Path:
    clean_target = target.split("#", 1)[0].split("?", 1)[0].strip()
    return (source_file.parent / clean_target).resolve()


def test_local_markdown_links_are_valid() -> None:
    broken_links = validate_links()
    assert not broken_links, "Broken markdown links found:\n" + "\n".join(broken_links)


def test_missing_anchor_is_reported(tmp_path: Path) -> None:
    source = tmp_path / "source.md"
    target = tmp_path / "target.md"
    source.write_text("[Target](target.md#missing)\n", encoding="utf-8")
    target.write_text("# Existing heading\n", encoding="utf-8")

    errors = validate_links(tmp_path, tmp_path)

    assert errors == ["source.md: missing anchor -> target.md#missing"]
