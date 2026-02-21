import { ENV } from "../lib/env.js";
import type { Express } from "express";
import http from "http";
import { attachWebSocketServer } from "../ws/server.js";


const startServer = (app: Express) => {
  const port = Number(ENV.PORT) || 3002;
  const host = (ENV.HOST) || "0.0.0.0"
  const server = http.createServer(app)
  const { broadcastMatchCreated } = attachWebSocketServer(server);
  app.locals.broadcastMatchCreated = broadcastMatchCreated;
  const serverMain = server.listen(port, host, () => {
    console.log(`App running on port ${port}`);
  });

  serverMain.on("error", (err: NodeJS.ErrnoException) => {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  });

  return serverMain;
};

export default startServer;
