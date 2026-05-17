# Architecture

`frontend-contract-testing-for-wordpress` is a TypeScript starter that models how a WordPress or headless platform team could validate live payload shapes against frontend component contracts before release.

## App surfaces

- `src/app.ts`
  - Express routes and API dispatch
- `src/services/contractService.ts`
  - dashboard summary, fixtures, failures, contract matrix, and verification lanes
- `src/services/render.ts`
  - HTML shell and route-specific views
- `src/data/sampleContracts.ts`
  - sample REST and WPGraphQL fixtures plus modeled route failures

## Modeled concerns

- fixture freshness and validation lag
- expected vs actual field counts
- missing fields
- type mismatches
- route-level blocked and watch states
- REST fallback confidence vs GraphQL drift

## Goal

Turn frontend payload safety into a reviewable release surface instead of discovering broken WordPress routes only after publish or deploy.
