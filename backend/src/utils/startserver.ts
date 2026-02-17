import { ENV } from "../lib/env.js";
import type { Express } from "express";

const startServer = (app: Express) => {
  const port = Number(ENV.PORT) || 3002;

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  });

  return server;
};

export default startServer;
