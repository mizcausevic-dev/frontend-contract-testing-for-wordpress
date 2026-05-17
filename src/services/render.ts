import { contractMatrix, failures, fixtures, summary, verification } from "./contractService";

function shell(active: string, title: string, eyebrow: string, hero: string, intro: string, content: string) {
  const stats = summary();
  const links = [
    { href: "/", label: "Overview" },
    { href: "/contract-matrix", label: "Contract matrix" },
    { href: "/payload-failures", label: "Payload failures" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  const nav = links
    .map(({ href, label }) => {
      const state = href === active ? "nav-link is-active" : "nav-link";
      return `<a class="${state}" href="${href}">${label}</a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #08111f;
        --panel: rgba(12, 20, 37, 0.92);
        --panel-soft: rgba(18, 29, 50, 0.86);
        --line: rgba(134, 167, 255, 0.12);
        --text: #f5f8ff;
        --muted: #98a7c5;
        --accent: #6fa0ff;
        --accent-2: #8f7cff;
        --good: #35c26b;
        --watch: #f0b94d;
        --bad: #ff6f7d;
        --shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(111, 160, 255, 0.18), transparent 22%),
          radial-gradient(circle at top right, rgba(143, 124, 255, 0.12), transparent 18%),
          linear-gradient(180deg, #07111e 0%, #0b1423 100%);
      }

      .page {
        width: min(1480px, calc(100% - 48px));
        margin: 28px auto 44px;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 18px 20px;
        border: 1px solid var(--line);
        border-radius: 28px;
        background: rgba(7, 15, 29, 0.92);
        box-shadow: var(--shadow);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
      }

      .brand-badge {
        width: 54px;
        height: 54px;
        border-radius: 18px;
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(135deg, #4d8cff, #8f7cff);
      }

      .brand-title {
        margin: 0;
        font-size: 17px;
        font-weight: 700;
      }

      .brand-subtitle {
        margin-top: 4px;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #93c0ff;
        font-weight: 600;
      }

      .nav {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .nav-link {
        padding: 12px 18px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #d8e2f6;
        text-decoration: none;
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .nav-link.is-active {
        color: #fff;
        border-color: transparent;
        background: linear-gradient(135deg, #4d8cff, #8f7cff);
      }

      .hero {
        margin-top: 22px;
        padding: 38px;
        border-radius: 32px;
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(12, 20, 37, 0.95), rgba(9, 16, 30, 0.95));
        box-shadow: var(--shadow);
      }

      .eyebrow {
        margin: 0 0 16px;
        color: var(--accent);
        font-size: 13px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        font-weight: 700;
      }

      h1 {
        margin: 0;
        max-width: 1080px;
        font-family: "IBM Plex Serif", Georgia, serif;
        font-size: clamp(52px, 5vw, 80px);
        line-height: 0.95;
        letter-spacing: -0.04em;
      }

      .intro {
        max-width: 980px;
        margin: 20px 0 0;
        color: var(--muted);
        font-size: 18px;
        line-height: 1.56;
      }

      .lead {
        margin-top: 24px;
        padding: 18px 20px;
        border-radius: 22px;
        border: 1px solid rgba(111, 160, 255, 0.16);
        background: rgba(111, 160, 255, 0.08);
      }

      .lead-label {
        margin: 0 0 8px;
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .lead-copy {
        margin: 0;
        font-size: 17px;
        font-weight: 700;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
        margin-top: 26px;
      }

      .card {
        padding: 24px;
        border-radius: 28px;
        border: 1px solid var(--line);
        background: var(--panel-soft);
      }

      .metric-label, .meta-key {
        margin: 0;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .metric-value {
        margin: 14px 0 8px;
        font-size: 54px;
        line-height: 0.95;
        font-weight: 700;
      }

      .metric-copy, .section-copy, .small {
        color: var(--muted);
        font-size: 15px;
        line-height: 1.52;
      }

      .section-grid {
        display: grid;
        grid-template-columns: 1.18fr 0.9fr;
        gap: 18px;
        margin-top: 18px;
      }

      .section-title {
        margin: 0 0 12px;
        font-family: "IBM Plex Serif", Georgia, serif;
        font-size: 36px;
        line-height: 1.02;
        letter-spacing: -0.03em;
      }

      .list {
        display: grid;
        gap: 14px;
      }

      .item {
        padding: 18px 20px;
        border-radius: 22px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.02);
      }

      .item-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .item-title {
        margin: 0;
        font-size: 28px;
        line-height: 1.04;
        font-weight: 700;
      }

      .item-subtitle {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 14px;
      }

      .status {
        display: inline-flex;
        align-items: center;
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-weight: 700;
        white-space: nowrap;
      }

      .status.healthy { color: var(--good); background: rgba(53, 194, 107, 0.12); }
      .status.watch { color: var(--watch); background: rgba(240, 185, 77, 0.12); }
      .status.blocked, .status.breaking { color: var(--bad); background: rgba(255, 111, 125, 0.12); }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(111, 160, 255, 0.12);
        color: #b6d3ff;
        font-size: 12px;
        font-weight: 700;
      }

      .meta-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 14px;
      }

      .meta {
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.03);
      }

      .meta-value {
        margin: 8px 0 0;
        font-size: 24px;
        line-height: 1;
        font-weight: 700;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .table th, .table td {
        padding: 14px 12px;
        border-bottom: 1px solid var(--line);
        text-align: left;
        vertical-align: top;
      }

      .table th {
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      code {
        font-family: "IBM Plex Mono", monospace;
      }

      .docs-list {
        display: grid;
        gap: 14px;
      }

      @media (max-width: 1180px) {
        .metrics, .meta-row, .section-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 860px) {
        .page { width: min(100% - 24px, 1480px); margin-top: 16px; }
        .topbar { flex-direction: column; align-items: stretch; }
        .nav { justify-content: flex-start; }
        .metrics, .meta-row, .section-grid { grid-template-columns: 1fr; }
        .item-top { flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="topbar">
        <div class="brand">
          <div class="brand-badge">FC</div>
          <div>
            <p class="brand-title">Frontend Contract Testing for WordPress</p>
            <div class="brand-subtitle">WordPress + Headless Payload Validation Surface</div>
          </div>
        </div>
        <nav class="nav">${nav}</nav>
      </header>

      <section class="hero">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${hero}</h1>
        <p class="intro">${intro}</p>
        <div class="lead">
          <p class="lead-label">Lead recommendation</p>
          <p class="lead-copy">${stats.leadRecommendation}</p>
        </div>
        ${content}
      </section>
    </main>
  </body>
</html>`;
}

export function renderOverview() {
  const stats = summary();
  const metricCards = [
    ["Fixtures tracked", String(stats.fixtureCount), "Stored WordPress payload fixtures currently under contract review."],
    ["Blocked routes", String(stats.blockedCount), "Payloads that should not move into release until the frontend contract is restored."],
    ["Stale fixtures", String(stats.staleFixtureCount), "Fixtures that have gone too long without validation against live content shape."],
    ["Aligned coverage", `${stats.alignedCoverage}%`, "Routes currently holding a clean frontend contract without missing fields or type drift."]
  ]
    .map(
      ([label, value, copy]) => `
        <article class="card">
          <p class="metric-label">${label}</p>
          <p class="metric-value">${value}</p>
          <p class="metric-copy">${copy}</p>
        </article>`
    )
    .join("");

  const fixtureList = fixtures()
    .slice(0, 2)
    .map(
      (fixture) => `
        <article class="item">
          <div class="item-top">
            <div>
              <h3 class="item-title">${fixture.component}</h3>
              <p class="item-subtitle"><code>${fixture.route}</code> · ${fixture.source} fixture · schema ${fixture.schemaVersion}</p>
            </div>
            <span class="status ${fixture.status}">${fixture.status}</span>
          </div>
          <div class="meta-row">
            <div class="meta"><p class="meta-key">Validation gap</p><p class="meta-value">${fixture.validationGapDays}d</p></div>
            <div class="meta"><p class="meta-key">Expected fields</p><p class="meta-value">${fixture.expectedFields.length}</p></div>
            <div class="meta"><p class="meta-key">Missing fields</p><p class="meta-value">${fixture.missingFields.length}</p></div>
            <div class="meta"><p class="meta-key">Type drift</p><p class="meta-value">${fixture.typeMismatches.length}</p></div>
          </div>
          <p class="small">${fixture.recommendation}</p>
          <div class="chips">${fixture.missingFields.map((field) => `<span class="chip">${field}</span>`).join("") || `<span class="chip">No missing fields</span>`}</div>
        </article>`
    )
    .join("");

  const failureList = failures()
    .map(
      (failure) => `
        <article class="item">
          <div class="item-top">
            <div>
              <h3 class="item-title">${failure.component}</h3>
              <p class="item-subtitle"><code>${failure.route}</code> · owner ${failure.owner}</p>
            </div>
            <span class="status ${failure.severity}">${failure.severity}</span>
          </div>
          <p class="small"><strong>${failure.summary}</strong></p>
          <p class="small">${failure.reason}</p>
        </article>`
    )
    .join("");

  return shell(
    "/",
    "Frontend Contract Testing for WordPress",
    "Frontend contract testing for WordPress",
    "Catch payload breakage before a WordPress content change breaks the frontend.",
    "WordPress and headless teams usually notice contract drift too late, after a page template, search surface, or answer packager is already running on the wrong payload shape. This repo turns those mismatches into a reviewable release gate.",
    `
      <section class="metrics">${metricCards}</section>
      <section class="section-grid">
        <article class="card">
          <h2 class="section-title">Which payload fixtures are closest to breaking delivery.</h2>
          <p class="section-copy">The fixture layer should tell you whether a route still matches the component contract before the deploy or publish lane moves forward.</p>
          <div class="list">${fixtureList}</div>
        </article>
        <article class="card">
          <h2 class="section-title">Which failures deserve intervention first.</h2>
          <p class="section-copy">Missing fields and type mismatches need to be tied to real route and component failures, not just abstract schema diffs.</p>
          <div class="list">${failureList}</div>
        </article>
      </section>`
  );
}

export function renderContractMatrix() {
  const rows = contractMatrix()
    .map(
      (fixture) => `
        <tr>
          <td><strong>${fixture.component}</strong><div class="small"><code>${fixture.route}</code></div></td>
          <td>${fixture.source}</td>
          <td>${fixture.schemaVersion}</td>
          <td>${fixture.validationGapDays}d</td>
          <td>${fixture.expectedFieldCount}</td>
          <td>${fixture.actualFieldCount}</td>
          <td>${fixture.missingFields.length}</td>
          <td>${fixture.typeMismatches.length}</td>
          <td><span class="status ${fixture.status}">${fixture.status}</span></td>
        </tr>`
    )
    .join("");

  return shell(
    "/contract-matrix",
    "Contract Matrix",
    "Contract matrix",
    "See every fixture, route, and component contract in one release table.",
    "The matrix view shows which WordPress payloads are still aligned, which ones are drifting, and where missing fields or typed mismatches should block the next release.",
    `
      <section class="section-grid" style="grid-template-columns: 1fr;">
        <article class="card">
          <h2 class="section-title">Every payload contract that matters before publish.</h2>
          <p class="section-copy">REST and WPGraphQL routes can both be safe, but only if the fixture layer keeps up with what the frontend actually expects.</p>
          <table class="table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Source</th>
                <th>Schema</th>
                <th>Gap</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Missing</th>
                <th>Type drift</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </article>
      </section>`
  );
}

export function renderPayloadFailures() {
  const items = fixtures()
    .filter((fixture) => fixture.status !== "healthy")
    .map(
      (fixture) => `
        <article class="item">
          <div class="item-top">
            <div>
              <h3 class="item-title">${fixture.component}</h3>
              <p class="item-subtitle"><code>${fixture.route}</code> · ${fixture.source} fixture</p>
            </div>
            <span class="status ${fixture.status}">${fixture.status}</span>
          </div>
          <p class="small">${fixture.note}</p>
          <div class="chips">
            ${fixture.missingFields.map((field) => `<span class="chip">Missing: ${field}</span>`).join("")}
            ${fixture.typeMismatches.map((mismatch) => `<span class="chip">${mismatch.field}: ${mismatch.expected} → ${mismatch.actual}</span>`).join("")}
          </div>
        </article>`
    )
    .join("");

  return shell(
    "/payload-failures",
    "Payload Failures",
    "Payload failures",
    "See exactly where WordPress payloads no longer match the frontend contract.",
    "This view is about real delivery risk: missing fields, changed types, and stale fixtures tied to named routes and components instead of a vague schema warning.",
    `
      <section class="section-grid" style="grid-template-columns: 1fr;">
        <article class="card">
          <h2 class="section-title">Failure details the frontend team can act on immediately.</h2>
          <p class="section-copy">A useful contract-testing surface should tell engineering and content teams what broke, why it matters, and what must change before release.</p>
          <div class="list">${items}</div>
        </article>
      </section>`
  );
}

export function renderVerification() {
  const lanes = verification()
    .map(
      (lane) => `
        <article class="item">
          <div class="item-top">
            <div>
              <h3 class="item-title">${lane.label}</h3>
              <p class="item-subtitle">${lane.detail}</p>
            </div>
            <span class="status ${lane.status}">${lane.status}</span>
          </div>
        </article>`
    )
    .join("");

  return shell(
    "/verification",
    "Verification",
    "Verification lanes",
    "Make frontend contract safety something the release process can actually verify.",
    "The verification layer needs to cover freshness, GraphQL stability, and fallback delivery confidence together or teams still ship routes they should have stopped.",
    `
      <section class="section-grid">
        <article class="card">
          <h2 class="section-title">The release proof that matters.</h2>
          <p class="section-copy">Verification should show whether fixtures are fresh, whether GraphQL payloads still match the component contract, and whether fallback routes remain safe.</p>
          <div class="list">${lanes}</div>
        </article>
        <article class="card">
          <h2 class="section-title">What a passing gate should mean.</h2>
          <div class="docs-list">
            <div><strong>1.</strong> <code>Critical fixtures have been revalidated recently.</code></div>
            <div><strong>2.</strong> <code>Missing fields and type drift are caught before publish.</code></div>
            <div><strong>3.</strong> <code>WPGraphQL and REST routes both map cleanly to the frontend contract.</code></div>
            <div><strong>4.</strong> <code>Blocked routes stay out of release until the fixture passes again.</code></div>
          </div>
        </article>
      </section>`
  );
}

export function renderDocs() {
  return shell(
    "/docs",
    "Docs",
    "Docs",
    "Understand the exact surfaces this starter is modeling.",
    "This repo is intentionally scoped like a portfolio proof system: realistic enough to show how fixture-based contract testing works without pretending to be a drop-in production harness.",
    `
      <section class="section-grid" style="grid-template-columns: 1fr;">
        <article class="card">
          <h2 class="section-title">What this starter includes.</h2>
          <div class="docs-list">
            <div><strong>Overview:</strong> high-level route health, stale fixture pressure, and missing field counts.</div>
            <div><strong>Contract matrix:</strong> one place to compare expected fields, actual fields, gaps, and drift by route.</div>
            <div><strong>Payload failures:</strong> route-specific missing field and typed mismatch details.</div>
            <div><strong>Verification:</strong> release-lane proof for fixture freshness, GraphQL stability, and REST fallback confidence.</div>
            <div><strong>APIs:</strong> JSON outputs for dashboard summary, fixtures, failures, matrix, and verification lanes.</div>
          </div>
        </article>
      </section>`
  );
}
