# Resource Catalog Seed — July 30, 2026

## Purpose

This seed establishes an initial source-backed catalog for all approved resource categories, prioritizing Indianapolis, Marion County, Central Indiana, and statewide programs that serve local users.

It is not an exhaustive directory. The coverage engine should evaluate this seed against `config/resource-categories.json` and create targeted discovery objectives for remaining gaps.

## Inclusion Rules

A record was included when it met at least one of these conditions:

- it is an official government program or agency;
- it is an official provider with a clear public service description;
- it is a university or Extension service;
- it is verified INDYpendent Bytes partner knowledge; or
- it is a recognized resource navigator whose role is clearly labeled.

## Important Distinctions

### Navigators versus direct providers

Indiana 211 and Indiana Reentry Corporation are navigation resources. They must not be described as directly funding or delivering every service represented by their tags.

### Entity records versus opportunity records

Organizations such as CICF, United Way of Central Indiana, IEDC, ISBDC, SBA, USDA NRCS, and IHCDA are durable entity records. Individual grants, application rounds, cohorts, and funding windows should be stored separately as opportunity records linked to those entities.

### Time-limited programs

INTAP, SSBCI provider availability, grant rounds, internships, and cohort-based training require recurring status checks. Their presence in the catalog does not mean applications are always open.

### Land access

USDA NRCS provides conservation and producer assistance but generally does not provide land. It is included under land access because it supports land-use readiness and stewardship. The coverage engine should continue searching for direct Indianapolis land-matching, leasing, incubator-farm, and land-host resources.

## Known Remaining Discovery Priorities

The following categories need deeper local discovery even though they now have at least one seed record:

1. Direct emergency cash assistance and township assistance by Indianapolis address.
2. Direct cultivator land access, incubator plots, leases, and land-host matching.
3. Local procurement buyers beyond government-contracting assistance.
4. Local-food wholesale and institutional market-access programs.
5. Affordable or subsidized transportation beyond fixed-route public transit.
6. Child-care subsidies, emergency child care, and nontraditional-hour care.
7. Affordable health care, behavioral health, dental care, and prescription assistance.
8. Business grants and loan funds currently accepting applications.
9. Reentry entrepreneurship and business-ownership programs.
10. Veteran entrepreneurship and veteran-owned business procurement programs.

## Verification Policy

Every record must retain:

- official URL;
- source authority class;
- verification status;
- last verification time;
- service area;
- direct-provider or navigator designation; and
- time-limited status when applicable.

The monitoring service should archive unavailable records rather than delete them and should open a review proposal when a program changes eligibility, geography, cost, funding, deadline, or application route.
