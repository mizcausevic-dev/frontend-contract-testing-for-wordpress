import app from "../src/app";

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
  const server = app.listen(0, "127.0.0.1");

  try {
    const address = await new Promise<import("node:net").AddressInfo>((resolve, reject) => {
      server.once("listening", () => {
        const activeAddress = server.address();
        if (!activeAddress || typeof activeAddress === "string") {
          reject(new Error("Could not resolve listening address"));
          return;
        }
        resolve(activeAddress);
      });
      server.once("error", reject);
    });

    const base = `http://127.0.0.1:${address.port}`;

    for (const route of routes) {
      const response = await fetch(`${base}${route}`);
      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status} for ${route}`);
      }
    }
    console.log("smoke check passed");
  } finally {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
