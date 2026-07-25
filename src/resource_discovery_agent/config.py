"""Environment-backed repository settings."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True, slots=True)
class Settings:
    catalog_path: Path
    guide_path: Path
    schema_dir: Path

    @classmethod
    def from_environment(cls, root: Path | None = None) -> Settings:
        base = root or Path.cwd()
        return cls(
            catalog_path=Path(
                os.getenv(
                    "RESOURCE_AGENT_CATALOG_PATH",
                    base
                    / "data"
                    / "source-catalog"
                    / "IB_User_Resource_Agent_Knowledge_Source_Catalog_v3.xlsx",
                )
            ),
            guide_path=Path(
                os.getenv(
                    "RESOURCE_AGENT_GUIDE_PATH",
                    base / "data" / "source-catalog" / "IB_User_Resource_Agent_Guide.pdf",
                )
            ),
            schema_dir=Path(os.getenv("RESOURCE_AGENT_SCHEMA_DIR", base / "schemas")),
        )
