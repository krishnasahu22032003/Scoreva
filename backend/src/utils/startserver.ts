import { ENV } from "../lib/env.js";
import type { Express } from "express";
import http from "http";
import { attachWebSocketServer } from "../ws/server.js";


const startServer = (app: Express) => {
  const port = Number(ENV.PORT) || 3002;
  const host = (ENV.HOST) || "0.0.0.0"
  const server = http.createServer(app)
  const { broadcastMatchCreated ,broadcastCommentary } = attachWebSocketServer(server);
  app.locals.broadcastMatchCreated = broadcastMatchCreated;
  app.locals.broadcastCommentary= broadcastCommentary;
  const serverMain = server.listen(port, host, () => {
    const baseURL = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`App running on ${baseURL}`);
    console.log(`Websocket server is running on ${baseURL.replace("http","ws")}/ws`);
  });

  serverMain.on("error", (err: NodeJS.ErrnoException) => {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  });

  return serverMain;
};

export default startServer;
