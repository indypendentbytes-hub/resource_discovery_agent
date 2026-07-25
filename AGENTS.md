# AGENTS.md

## Purpose

This repository contains the provider-neutral core for the INDYpendent Bytes
Resource Discovery Agent. The product helps users clarify goals, identify and
compare governed resources, prepare for engagement, and track outcomes.

Optimize for trustworthy progress, not answer volume or link discovery.

## Scope

These instructions apply to the entire repository. A more specific
`AGENTS.md` in a subdirectory may add or override instructions for that
subtree.

## Product principles

- Treat an unclear goal as a supported state. Help the user choose a direction
  and define a low-risk first step before matching resources.
- Ask only for intake information that can materially change a recommendation.
- Prefer free, authoritative, and directly eligible resources.
- Rank by functional fit, not popularity, name similarity, or keyword overlap.
- Explain every ranking using user facts, positive fit factors, disqualifiers,
  uncertainty, and deterministic tie-breaking.
- Distinguish verified facts, inferences, estimates, and unresolved questions.
- Include citations, preparation guidance, a measurable completion signal, and
  the next logical step.
- Do not present stale, closed, archived, quarantined, or unverified resources
  as currently available.
- Never guarantee eligibility, funding, approval, enrollment, certification,
  placement, or business success.

## Safety and escalation

Do not make legal, tax, lending, food-safety, pesticide, licensing, land-use,
crisis, or compliance determinations. Provide neutral preparation support,
identify what requires confirmation, and route the user to an appropriate
official or qualified professional.

Time-sensitive claims require live verification when practical, including:

- deadlines and application status;
- eligibility and service area;
- costs, program terms, and funding availability;
- contacts and application routes;
- cohort dates, registration capacity, and recalls.

When live verification is unavailable, label the limitation precisely and
provide an official confirmation route.

## Architecture

- Target Python 3.12.
- Keep the core domain provider-neutral.
- Pydantic models in `src/resource_discovery_agent/` are canonical.
- JSON Schemas in `schemas/` are generated artifacts and must remain in exact
  parity with their Pydantic models.
- External catalog, verification, persistence, applet, and vendor integrations
  belong behind protocols or adapters.
- Do not add a production API, database, live connector, or vendor-specific
  agent SDK unless the task explicitly authorizes it.
- Preserve the workflow:
  intake -> goal discovery -> retrieval -> verification -> ranking ->
  recommendation -> preparation -> progress -> escalation/next-stage routing.

Important locations:

- `src/resource_discovery_agent/domain.py`: canonical domain models.
- `src/resource_discovery_agent/orchestration.py`: provider-neutral workflow.
- `src/resource_discovery_agent/intake/`: intake and goal discovery.
- `src/resource_discovery_agent/retrieval/`: governed catalog loading.
- `src/resource_discovery_agent/verification/`: freshness and availability.
- `src/resource_discovery_agent/ranking/`: explainable scoring.
- `src/resource_discovery_agent/recommendation/`: recommendation bundles.
- `src/resource_discovery_agent/progress/`: goals, actions, evidence, outcomes.
- `src/resource_discovery_agent/escalation/`: safety and professional routing.
- `schemas/`: checked-in generated contracts.
- `data/source-catalog/`: governed source inputs and provenance.
- `prompts/`: provider-neutral behavior guidance.
- `tests/`: contracts, routing, ranking, verification, and safety tests.

## Governed data

- Treat the workbook and PDF under `data/source-catalog/` as governed product
  inputs, not casual fixtures.
- Preserve provenance, authority, status, refresh, citation, restriction, and
  escalation metadata during ingestion.
- Do not silently normalize away source conflicts or missing fields.
- The known discrepancy between the workbook's 171 governed records and the
  PDF headline count of 191 must remain visible as a review item.
- Do not commit the applet-inventory JSON or any internal applet IDs.
- Do not modify binary source files unless the task explicitly requires a
  governed data update.
- Never replace canonical URLs with tracking, redirect, or aggregator URLs.

BusinessApp.io is a curated freemium analytics resource. Preserve the
distinction between visibility metrics, engagement metrics, and conversion
metrics. Do not imply that visibility establishes customers or revenue.

## Frontend work

The customer-facing frontend may be added under `web/`.

- Keep frontend work isolated from the Python core unless an agreed contract
  change is required.
- Prefer Next.js, TypeScript, Tailwind CSS, and shadcn/ui for a v0-generated
  prototype.
- Follow accessible, calm, responsive interaction patterns inspired by GitHub
  Primer without copying GitHub branding.
- Support keyboard navigation, visible focus states, sufficient contrast, and
  meaning that does not depend on color alone.
- Design loading, empty, uncertain, stale, closed, and error states.
- Use typed mock data until backend endpoints are intentionally introduced.
- Do not add authentication, payments, persistence, analytics tracking, or
  production secrets without explicit authorization.
- Never place secrets in browser-visible environment variables or commit them.

## Coding conventions

- Use type annotations throughout production Python.
- Keep functions focused and domain names explicit.
- Prefer pure, deterministic logic for validation and ranking.
- Avoid hidden composite scores; retain individual scoring factors.
- Use Pydantic validation at system boundaries.
- Preserve backwards compatibility for checked-in contracts unless a breaking
  change is intentional and documented.
- Keep lines at or below 100 characters.
- Follow Ruff formatting/import expectations and strict mypy.
- Add or update tests for every behavioral change.
- Do not weaken validation or safety tests merely to make a build pass.

## Required validation

Set up the environment:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -e ".[dev]"
```

Before handing off Python, schema, catalog, prompt, or CI changes, run:

```powershell
.\.venv\Scripts\ruff check .
.\.venv\Scripts\mypy
.\.venv\Scripts\pytest
.\.venv\Scripts\resource-agent-export-schemas --check
.\.venv\Scripts\resource-agent-validate-catalog
```

For a narrow change, targeted tests may be run first, but the complete relevant
suite should pass before completion. If a required check cannot run, report the
exact command and reason.

## Git and change discipline

- Preserve user-authored and unrelated work in a dirty worktree.
- Do not modify `README.md` or governed assets incidentally.
- Make small, reviewable changes and avoid broad mechanical rewrites.
- Do not commit generated caches, virtual environments, secrets, or local
  editor state.
- Do not stage, commit, push, merge, or open a pull request unless explicitly
  requested.
- Never push directly to `main`; use a task branch and pull request.

## Definition of done

A change is complete when:

- the requested behavior is implemented;
- domain and JSON contracts remain aligned;
- relevant tests cover success, uncertainty, invalid input, and safety cases;
- governed-source metadata and citations are preserved;
- verification and escalation requirements remain explicit;
- relevant validation commands pass; and
- documentation is updated when behavior or architecture changes.
