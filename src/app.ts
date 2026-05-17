import express from "express";

import { contractMatrix, failures, fixtures, payload, summary, verification } from "./services/contractService";
import {
  renderContractMatrix,
  renderDocs,
  renderOverview,
  renderPayloadFailures,
  renderVerification
} from "./services/render";

const app = express();
const port = Number(process.env.PORT ?? 5228);

app.get("/", (_req, res) => {
  res.type("html").send(renderOverview());
});

app.get("/contract-matrix", (_req, res) => {
  res.type("html").send(renderContractMatrix());
});

app.get("/payload-failures", (_req, res) => {
  res.type("html").send(renderPayloadFailures());
});

app.get("/verification", (_req, res) => {
  res.type("html").send(renderVerification());
});

app.get("/docs", (_req, res) => {
  res.type("html").send(renderDocs());
});

app.get("/api/dashboard/summary", (_req, res) => {
  res.json(summary());
});

app.get("/api/fixtures", (_req, res) => {
  res.json(fixtures());
});

app.get("/api/failures", (_req, res) => {
  res.json(failures());
});

app.get("/api/contract-matrix", (_req, res) => {
  res.json(contractMatrix());
});

app.get("/api/verification", (_req, res) => {
  res.json(verification());
});

app.get("/api/sample", (_req, res) => {
  res.json(payload());
});

if (require.main === module) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`Frontend Contract Testing for WordPress listening on http://127.0.0.1:${port}`);
  });
}

export default app;
