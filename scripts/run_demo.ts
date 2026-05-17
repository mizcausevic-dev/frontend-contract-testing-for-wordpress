import { contractMatrix, failures, summary } from "../src/services/contractService";

const dashboard = summary();

console.log(
  JSON.stringify(
    {
      dashboard,
      breakingFailures: failures().filter((failure) => failure.severity === "breaking"),
      contractSnapshot: contractMatrix().map((fixture) => ({
        fixtureKey: fixture.fixtureKey,
        status: fixture.status,
        missingFields: fixture.missingFields.length,
        typeMismatches: fixture.typeMismatches.length
      }))
    },
    null,
    2
  )
);
