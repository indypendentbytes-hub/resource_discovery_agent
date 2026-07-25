from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from pydantic import BaseModel

from resource_discovery_agent.models import (
    ProgressRecord,
    RecommendationBundle,
    SourceRecord,
    UserProfile,
)

SCHEMA_MODELS: dict[str, type[BaseModel]] = {
    "source.schema.json": SourceRecord,
    "user-profile.schema.json": UserProfile,
    "recommendation.schema.json": RecommendationBundle,
    "progress-record.schema.json": ProgressRecord,
}


def rendered_schemas() -> dict[str, str]:
    rendered = {}
    for filename, model in SCHEMA_MODELS.items():
        schema: dict[str, Any] = model.model_json_schema()
        rendered[filename] = json.dumps(schema, indent=2, sort_keys=True) + "\n"
    return rendered


def export_schemas(schema_dir: Path, *, check: bool = False) -> list[str]:
    differences = []
    schema_dir.mkdir(parents=True, exist_ok=True)
    for filename, content in rendered_schemas().items():
        path = schema_dir / filename
        if check:
            if not path.exists() or path.read_text(encoding="utf-8") != content:
                differences.append(filename)
        else:
            path.write_text(content, encoding="utf-8")
    return differences


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema-dir", type=Path, default=Path("schemas"))
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    differences = export_schemas(args.schema_dir, check=args.check)
    if differences:
        print("Schema drift: " + ", ".join(differences))
        return 1
    print("Schemas are current." if args.check else "Schemas exported.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
