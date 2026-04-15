import re
from pathlib import Path

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
    broken_links: list[str] = []

    for md_file in iter_markdown_files():
        text = md_file.read_text(encoding="utf-8")

        for _, target in LINK_RE.findall(text):
            target = target.strip()
            if not target or is_external_link(target):
                continue

            resolved = resolve_local_link(md_file, target)
            if not resolved.exists():
                rel_file = md_file.relative_to(ROOT).as_posix()
                broken_links.append(f"{rel_file}: {target}")

    assert not broken_links, "Broken markdown links found:\n" + "\n".join(broken_links)
