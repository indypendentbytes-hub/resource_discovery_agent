# Architecture

## Governing scope

The Resource Discovery Agent is a general-purpose opportunity and support
navigation system. It supports entrepreneurs, owners, nonprofits, freelancers,
workers, students, researchers, investors, community organizations, growers,
food businesses, and employers. Agriculture is one pathway, not the governing
classification model.

Resources qualify through direct assistance, funding or financial access,
useful public information, business-enabling infrastructure, or opportunity
access.

## Flow

```mermaid
flowchart LR
    I["Minimal intake"] --> G["Goal discovery or confirmation"]
    G --> R["Governed retrieval"]
    R --> V["Live verification"]
    V --> K["Free-first explainable ranking"]
    K --> C["Comparison"]
    C --> P["Engagement preparation"]
    P --> T["Progress and outcome"]
    T --> N["Next-stage routing"]
```

Pydantic models are canonical and produce checked-in JSON Schemas. Provider
integrations implement protocols for catalog retrieval, live verification, and
progress persistence.

## Applet inventory

The supplied JSON is an applet access inventory, not an executable agent graph.
It identifies **Resource Intelligence Layer**, **INDYpendent Bytes**, and **Sous
Engine Workspace** as related surfaces. Internal IDs are not committed, and the
core does not depend on them.

## Goal discovery

An empty goal is a supported state, not an intake failure. The goal-setting
service proposes up to three directions based on the user's words and known
constraints. Every option includes a rationale, first experiment, success
signal, and unresolved questions. Resource matching starts after the user
selects or revises a direction.

## Commercial resources

Commercial tools are valid when they fill a meaningful gap, but rank after free
and subsidized alternatives by default. A paid option can move higher only with
an explicit, auditable exception reason.

BusinessApp.io is maintained as curated source `SRC-172`. It is simultaneously
typed as `free_business_resource`, `analytics_tool`, and
`commercial_freemium_tool`, with a `free_basic_tier` and optional paid upgrades.
It is useful for baseline visibility and marketing analytics, but it is not
funding or a public-data source. Plan coverage and connected-account
requirements must be verified live.
