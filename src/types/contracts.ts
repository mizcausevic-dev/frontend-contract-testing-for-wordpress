export type SurfaceStatus = "healthy" | "watch" | "blocked";

export type PayloadFixture = {
  fixtureKey: string;
  route: string;
  source: "wpgraphql" | "rest";
  component: string;
  schemaVersion: string;
  validationGapDays: number;
  status: SurfaceStatus;
  expectedFields: string[];
  actualFields: string[];
  missingFields: string[];
  typeMismatches: Array<{
    field: string;
    expected: string;
    actual: string;
  }>;
  note: string;
  recommendation: string;
};

export type ContractFailure = {
  fixtureKey: string;
  route: string;
  component: string;
  severity: "breaking" | "watch";
  summary: string;
  reason: string;
  owner: string;
};

export type VerificationLane = {
  label: string;
  status: SurfaceStatus;
  detail: string;
};
