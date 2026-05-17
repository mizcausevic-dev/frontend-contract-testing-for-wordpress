import { describe, expect, test } from "vitest";

import { contractMatrix, failures, fixtures, payload, summary, verification } from "./services/contractService";

describe("frontend-contract-testing-for-wordpress", () => {
  test("summary reflects blocked and stale fixtures", () => {
    const stats = summary();
    expect(stats.fixtureCount).toBe(5);
    expect(stats.blockedCount).toBeGreaterThan(0);
    expect(stats.staleFixtureCount).toBeGreaterThan(0);
  });

  test("fixtures and failures expose real contract breakage", () => {
    expect(fixtures().some((fixture) => fixture.missingFields.length > 0)).toBe(true);
    expect(failures().some((failure) => failure.severity === "breaking")).toBe(true);
  });

  test("payload includes matrix and verification lanes", () => {
    expect(contractMatrix().length).toBe(5);
    expect(verification().length).toBe(3);
    expect(payload()).toHaveProperty("dashboard");
  });
});
