# RDA Horticulture Planning Capability

## Purpose

RDA's horticulture capability converts a real buyer/product requirement into a defensible production requirement, compares that requirement with known grower capability, and sends only unresolved gaps into normal resource discovery.

It is not a generic farming-advice chatbot and it must not invent crop-science values.

## Specialist roles inside RDA

### 1. Demand-to-Production Translator

Input:
- SKU / product
- quantity
- output unit
- harvest week or delivery period
- specification IDs
- approved crop planning profile

Output:
- planning capacity unit
- required capacity range (low/base/high)
- production system
- yield range used
- maturity/harvest/succession timing
- risk tier
- evidence/source metadata

### 2. Grower Feasibility Analyst

Compares the production requirement with known grower/plot facts.

Examples:
- required bed-feet vs available bed-feet
- required production system vs grower production system
- irrigation required vs irrigation available
- land/plot capacity
- required infrastructure capability

Missing data is never treated as a failed capability. It is returned as a missing fact so RDA can ask for only the information needed for the current decision.

### 3. Gap-to-Resource Translator

Turns a horticultural feasibility gap into a neutral RDA resource need.

Example:

Buyer demand -> 9,600 lb tomatoes over an 8-week period
-> approved crop profile calculates productive capacity required
-> grower has less available capacity than required
-> production-capacity gap is emitted
-> RDA searches land, infrastructure, technical assistance, labor, financing, or other relevant resources.

This layer does not pick a provider. It describes the need.

### 4. Evidence / Horticulture Review Gate

Agronomic assumptions must have evidence metadata and should use a source hierarchy:

1. PRIMARY — Extension, USDA, land-grant university, official trials/publications.
2. REVIEWED — locally reviewed by a qualified horticulture expert.
3. SECONDARY — reputable technical source not yet locally validated.
4. SELF_REPORTED — grower observation or experience.
5. UNKNOWN — insufficient evidence.

RDA should escalate to qualified human review when:
- an approved unit conversion is missing;
- source evidence conflicts materially;
- local conditions make published yield/timing assumptions unreliable;
- crop profile values have not been approved for production planning;
- pest/disease diagnosis, pesticide advice, or other regulated/high-risk determinations are requested.

## System boundary with INDYpendent Bytes

This capability does not change IB's production lifecycle.

IB lifecycle remains:

Buyer demand / opportunity -> Grower claim -> Allocation -> ProductionRecord -> IntakeRecord -> Fulfillment -> Settlement

The horticulture capability supports planning and feasibility. It does not allocate production, create a ProductionRecord, verify physical intake, or calculate settlement.

## Data flow

Real buyer requirement
-> approved CropPlanningProfile-style evidence
-> production requirement
-> known grower/plot capability
-> feasibility result
-> resource gap(s)
-> RDA discovery/routing
-> resource connection or human escalation

## Core implementation

`src/agent/horticulturePlanning.js`

Exports:
- `translateDemandToProductionRequirement`
- `assessGrowerProductionFit`
- `gapsToResourceNeeds`
- `runHorticulturePlanning`

## Design rule

People and external sources report observations. RDA derives planning conclusions. The system must retain the distinction between self-reported, externally sourced, reviewed, and system-derived data.
