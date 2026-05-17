# Why We Built This

Headless WordPress teams often do a decent job thinking about content models and schema changes, but they still get surprised when the frontend breaks. The reason is simple: knowing that a model changed is not the same as knowing whether a real route payload still satisfies the component contract that renders it.

A field can disappear without crashing the CMS. A nested collection can quietly change shape in GraphQL. A REST fallback route might still be stable while the richer GraphQL version has already drifted. Those are the kinds of issues that slip past schema reviews and still land in production if nobody is checking the route fixtures that the frontend actually relies on.

That is the gap this repo is meant to make visible. `frontend-contract-testing-for-wordpress` treats payload fixtures as a release artifact. It shows which routes are healthy, which ones are drifting, which ones are carrying missing fields, and where typed mismatches should block the next publish or deploy.

Existing tooling usually helps only at one layer. Schema diffing can tell you that something changed. Browser testing can show that a page broke after the fact. API traces might show shape or latency problems in isolation. But teams still need a simple control surface that ties route, source, component, freshness, missing fields, and type drift together in one place.

The design philosophy here is operator-first and release-friendly. The point is not to create a giant abstract testing platform. The point is to make contract safety easy to review before a change goes live. That is why the starter stays focused on a small set of views: overview, contract matrix, payload failures, and verification.

In a fuller production setup, this pattern would evolve into generated fixture snapshots, CI-enforced contract tests, schema version pinning, and environment-specific validation against real WordPress payloads. But even before any of that is fully automated, teams benefit from having a clear way to see which routes are safe and which ones should be stopped.
