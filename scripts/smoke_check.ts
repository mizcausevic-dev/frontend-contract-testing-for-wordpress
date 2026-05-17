import app from "../src/app";

const port = 5228;
const base = `http://127.0.0.1:${port}`;
const routes = [
  "/",
  "/contract-matrix",
  "/payload-failures",
  "/verification",
  "/docs",
  "/api/dashboard/summary",
  "/api/fixtures",
  "/api/failures",
  "/api/contract-matrix",
  "/api/verification",
  "/api/sample"
];

async function main() {
  const server = app.listen(port, "127.0.0.1");

  try {
    for (const route of routes) {
      const response = await fetch(`${base}${route}`);
      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status} for ${route}`);
      }
    }
    console.log("smoke check passed");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
