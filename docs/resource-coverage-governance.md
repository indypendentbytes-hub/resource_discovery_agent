# Resource Category Coverage and Gap Reporting

## Purpose

The Resource Discovery Agent must identify where its knowledge base is too thin to support reliable recommendations. It should surface gaps rather than presenting a small or weak resource set as complete.

## Decided Categories

Coverage is evaluated only against an approved category registry. The initial registry is stored in `config/resource-categories.json` and may be revised by administrators.

Each category may define:

- priority;
- minimum total resources;
- minimum verified resources; and
- minimum resources serving the target geography.

## Gap States

- `MISSING`: no useful entity is assigned to the category.
- `SCARCE`: some entities exist, but the total is below the configured minimum.
- `LOW_VERIFICATION`: enough entities exist, but too few are verified.
- `GEOGRAPHIC_GAP`: enough resources may exist generally, but too few serve the selected geography.
- `SUFFICIENT`: all configured minimums are met.

## Required Output

A coverage report must include:

- category name;
- coverage status;
- category priority;
- total, verified, and local counts;
- configured thresholds;
- specific gap reasons;
- matching entity IDs; and
- a recommended discovery action.

Critical and high-priority gaps must be surfaced before normal categories.

## Discovery Response

A gap does not authorize the system to invent resources or lower verification standards. It should instead create a targeted discovery objective containing:

- missing category;
- target geography;
- audience or eligibility segment when relevant;
- required resource count;
- preferred authoritative sources; and
- verification and deduplication requirements.

## User-Facing Transparency

When recommendations are generated from an under-covered category, the agent should state that available coverage is limited and avoid implying that the listed resources are exhaustive.
