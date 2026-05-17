import { contractFailures, payloadFixtures, verificationLanes } from "../data/sampleContracts";
import type { ContractFailure, PayloadFixture, VerificationLane } from "../types/contracts";

export function summary() {
  const blockedCount = payloadFixtures.filter((fixture) => fixture.status === "blocked").length;
  const watchCount = payloadFixtures.filter((fixture) => fixture.status === "watch").length;
  const graphqlCount = payloadFixtures.filter((fixture) => fixture.source === "wpgraphql").length;
  const staleFixtureCount = payloadFixtures.filter((fixture) => fixture.validationGapDays > 14).length;
  const missingFieldCount = payloadFixtures.reduce((sum, fixture) => sum + fixture.missingFields.length, 0);
  const typedMismatchCount = payloadFixtures.reduce((sum, fixture) => sum + fixture.typeMismatches.length, 0);
  const alignedContracts =
    payloadFixtures.filter((fixture) => fixture.status === "healthy").length / Math.max(payloadFixtures.length, 1);

  return {
    fixtureCount: payloadFixtures.length,
    blockedCount,
    watchCount,
    graphqlCount,
    staleFixtureCount,
    missingFieldCount,
    typedMismatchCount,
    alignedCoverage: Math.round(alignedContracts * 100),
    leadRecommendation:
      "Fail the next release if the help article and docs search fixtures are not restored to the expected frontend contract before publish."
  };
}

export function fixtures(): PayloadFixture[] {
  const rank: Record<PayloadFixture["status"], number> = { blocked: 0, watch: 1, healthy: 2 };
  return [...payloadFixtures].sort((left, right) => rank[left.status] - rank[right.status]);
}

export function failures(): ContractFailure[] {
  const rank: Record<ContractFailure["severity"], number> = { breaking: 0, watch: 1 };
  return [...contractFailures].sort((left, right) => rank[left.severity] - rank[right.severity]);
}

export function verification(): VerificationLane[] {
  const rank: Record<VerificationLane["status"], number> = { blocked: 0, watch: 1, healthy: 2 };
  return [...verificationLanes].sort((left, right) => rank[left.status] - rank[right.status]);
}

export function contractMatrix() {
  return fixtures().map((fixture) => ({
    fixtureKey: fixture.fixtureKey,
    route: fixture.route,
    source: fixture.source,
    component: fixture.component,
    schemaVersion: fixture.schemaVersion,
    status: fixture.status,
    validationGapDays: fixture.validationGapDays,
    expectedFieldCount: fixture.expectedFields.length,
    actualFieldCount: fixture.actualFields.length,
    missingFields: fixture.missingFields,
    typeMismatches: fixture.typeMismatches
  }));
}

export function payload() {
  return {
    dashboard: summary(),
    fixtures: fixtures(),
    failures: failures(),
    verification: verification(),
    contractMatrix: contractMatrix()
  };
}
