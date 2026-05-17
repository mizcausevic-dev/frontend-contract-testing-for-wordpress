import type { ContractFailure, PayloadFixture, VerificationLane } from "../types/contracts";

export const payloadFixtures: PayloadFixture[] = [
  {
    fixtureKey: "marketing-home-hero",
    route: "/",
    source: "wpgraphql",
    component: "HeroShell",
    schemaVersion: "2026.05.1",
    validationGapDays: 3,
    status: "healthy",
    expectedFields: ["headline", "subheadline", "ctaLabel", "ctaHref", "proofLogos"],
    actualFields: ["headline", "subheadline", "ctaLabel", "ctaHref", "proofLogos"],
    missingFields: [],
    typeMismatches: [],
    note: "The marketing hero contract is aligned with the frontend shell and safe for deploy.",
    recommendation: "Keep this fixture as the reference contract for anonymous marketing routes."
  },
  {
    fixtureKey: "pricing-table",
    route: "/pricing",
    source: "wpgraphql",
    component: "PricingComparisonTable",
    schemaVersion: "2026.05.4",
    validationGapDays: 11,
    status: "watch",
    expectedFields: ["tiers", "featureGroups", "faqBlocks", "usageMeteringKey"],
    actualFields: ["tiers", "featureGroups", "faqBlocks"],
    missingFields: ["usageMeteringKey"],
    typeMismatches: [],
    note: "The component still renders, but pricing analytics and usage exports are missing the metering field.",
    recommendation: "Block the next monetization rollout unless the metering key is reintroduced or the component contract changes."
  },
  {
    fixtureKey: "help-center-article",
    route: "/help/installing-tile",
    source: "rest",
    component: "HelpArticlePage",
    schemaVersion: "2026.05.2",
    validationGapDays: 19,
    status: "blocked",
    expectedFields: ["title", "body", "canonicalTopic", "faqBlocks", "relatedArticles"],
    actualFields: ["title", "body", "faqBlocks", "relatedArticles"],
    missingFields: ["canonicalTopic"],
    typeMismatches: [
      {
        field: "faqBlocks",
        expected: "FaqBlock[]",
        actual: "RichTextBlock[]"
      }
    ],
    note: "Search and answer surfaces will break because the article payload no longer matches what the page template and packager expect.",
    recommendation: "Restore canonicalTopic and separate FAQ blocks back into the expected typed collection before publish."
  },
  {
    fixtureKey: "resource-library-card-grid",
    route: "/resources",
    source: "rest",
    component: "ResourceCardGrid",
    schemaVersion: "2026.05.0",
    validationGapDays: 7,
    status: "healthy",
    expectedFields: ["cards", "filters", "featuredCard"],
    actualFields: ["cards", "filters", "featuredCard"],
    missingFields: [],
    typeMismatches: [],
    note: "Resource grid payload is aligned and still passes frontend contract validation.",
    recommendation: "Use this fixture as a baseline for testing other archive-style collection pages."
  },
  {
    fixtureKey: "docs-search-results",
    route: "/docs/search?q=cache",
    source: "wpgraphql",
    component: "DocsSearchResults",
    schemaVersion: "2026.05.3",
    validationGapDays: 22,
    status: "blocked",
    expectedFields: ["results", "facets", "spellCorrection", "totalCount"],
    actualFields: ["results", "facets", "totalCount"],
    missingFields: ["spellCorrection"],
    typeMismatches: [
      {
        field: "results",
        expected: "SearchResultCard[]",
        actual: "SearchResultNodeConnection"
      }
    ],
    note: "Search UX and no-result recovery both degrade when spell correction disappears and result node types drift.",
    recommendation: "Pin this route to a contract test in CI and fail the release when result node shape changes without a matching frontend update."
  }
];

export const contractFailures: ContractFailure[] = [
  {
    fixtureKey: "help-center-article",
    route: "/help/installing-tile",
    component: "HelpArticlePage",
    severity: "breaking",
    summary: "Article route is missing canonicalTopic and changed FAQ block typing.",
    reason: "SEO and answer-packaging logic expect a dedicated canonical topic plus typed FAQ blocks, but the payload no longer provides either cleanly.",
    owner: "web-platform"
  },
  {
    fixtureKey: "docs-search-results",
    route: "/docs/search?q=cache",
    component: "DocsSearchResults",
    severity: "breaking",
    summary: "Search results payload changed shape and dropped spellCorrection.",
    reason: "The component relies on corrected-query prompts and flattened result cards, so the route can no longer render the intended fallback states.",
    owner: "search-platform"
  },
  {
    fixtureKey: "pricing-table",
    route: "/pricing",
    component: "PricingComparisonTable",
    severity: "watch",
    summary: "Pricing payload is missing usageMeteringKey for downstream analytics.",
    reason: "The page still renders, but tracking and export contracts will drift if the monetization field stays absent.",
    owner: "revops-platform"
  }
];

export const verificationLanes: VerificationLane[] = [
  {
    label: "Frontend fixture freshness",
    status: "blocked",
    detail: "Two critical fixtures have not been revalidated in more than 14 days and are already carrying real contract breakage."
  },
  {
    label: "WPGraphQL payload stability",
    status: "watch",
    detail: "GraphQL-heavy routes need stronger typed fixture pinning before anonymous and search surfaces can move faster."
  },
  {
    label: "REST fallback confidence",
    status: "healthy",
    detail: "REST-backed archive and card-grid routes are holding stable and can serve as fallback delivery lanes when GraphQL contracts drift."
  }
];
