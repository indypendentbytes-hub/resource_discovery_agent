from __future__ import annotations

import argparse
import json
from pathlib import Path

from resource_discovery_agent.config import Settings
from resource_discovery_agent.retrieval.catalog import validate_workbook


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path)
    parser.add_argument("--guide-reported-count", type=int, default=191)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = validate_workbook(
        args.catalog or Settings.from_environment().catalog_path,
        guide_reported_count=args.guide_reported_count,
    )
    rendered = json.dumps(report.to_dict(), indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if report.is_valid else 1


if __name__ == "__main__":
    raise SystemExit(main())
