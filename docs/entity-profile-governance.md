# Entity Profile Creation and Maintenance

## Decision

The Resource Discovery Agent must create and maintain a canonical entity profile for every existing or newly discovered entity that is useful to a supported user pathway.

The profile represents the organization, person, agency, business, funder, provider, or program itself. Individual resources, grants, services, and opportunities remain separate records linked to the entity.

## Required Profile Information

Profiles should capture, when available and lawfully public:

- canonical and legal names;
- alternate or former names;
- official website;
- Google Business Profile URL, place ID, rating, and review count;
- verified social profiles;
- publicly documented owners, founders, parent organizations, and management;
- physical locations and service areas;
- aggregate review information with retrieval dates;
- a plain-language description;
- knowledge-base category;
- standardized tags;
- programs and services;
- source provenance;
- usefulness rationale;
- verification status; and
- version history.

## Useful-Entity Gate

Discovery does not automatically create a trusted entity profile. The system must first determine that the entity contributes to at least one supported outcome or pathway.

Examples include:

- emergency funding;
- food access;
- business funding;
- technical assistance;
- training;
- workforce development;
- transportation;
- land access;
- reentry support;
- legal assistance;
- procurement;
- market access; and
- nonprofit support.

Entities that are irrelevant, duplicative, predatory, inaccessible, unverifiable, or outside supported geography may be retained in a discovery queue but must not enter the trusted recommendation index.

## Identity Resolution

Before creating a new entity, compare it against existing profiles using:

1. Google place ID;
2. canonical domain;
3. normalized legal and public names;
4. verified social URLs;
5. location overlap; and
6. parent or ownership relationships.

A strong match updates the existing profile. An uncertain match enters review. The system must not create separate trusted entities merely because a program page, location page, social account, or directory listing uses a different name.

## Verification Boundaries

The following fields require attributable evidence and may not be inferred from appearance, surnames, social relationships, or third-party summaries:

- owners;
- founders;
- management;
- legal status;
- parent organization;
- service area;
- ratings and review counts; and
- official social accounts.

Unverified ownership or management data must be labeled `UNVERIFIED` or omitted. It must never be presented as established fact.

## Reviews

Store aggregate review metadata rather than copying full review text unless the review source explicitly permits reuse. Every rating must include its platform, review count, source URL when available, and retrieval timestamp because ratings change over time.

Reviews are context signals, not automatic measures of eligibility, trustworthiness, or program quality.

## Categories and Tags

`knowledge_base_category` is the entity's primary organizational category. Tags describe specific functions, audiences, services, or pathways.

Tags must be normalized to lowercase controlled vocabulary. New tags may be proposed, but synonymous tags should be merged rather than multiplying near-duplicates.

Example mappings:

- `emergency grant`, `crisis cash`, `emergency assistance` → `emergency funding`
- `entrepreneur funding`, `startup funding`, `small-business capital` → `business funding`
- `pantry`, `meal assistance`, `SNAP enrollment` → `food access`

## Entity-to-Resource Relationships

Entity profiles should link to separate knowledge records through explicit relationships:

- `OPERATES`
- `FUNDS`
- `ADMINISTERS`
- `OWNS`
- `PARTNERS_WITH`
- `REFERS_TO`
- `SERVES_AREA`
- `HAS_LOCATION`
- `OFFERS_PROGRAM`

This prevents entity details from being duplicated across every grant, service, or resource record.

## Maintenance

Entity profiles use the same governed update process as resource records. Changes to owners, management, legal identity, service area, location, ratings, or official channels require provenance, timestamps, comparison with the prior version, and review when material or conflicting.
