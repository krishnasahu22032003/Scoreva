import WebSocket, { WebSocketServer } from "ws";
import { Server } from "http";
import type { Match } from "../../generated/prisma/index.js";
import { wsArcjet } from "../arcjet.js";
import type { ArcjetNodeRequest } from "@arcjet/node";

export interface ExtendedWebSocket extends WebSocket {

    isAlive: Boolean

}

const matchSubscribers = new Map();

function subscribe(matchId:Number, socket:WebSocket) {
    if(!matchSubscribers.has(matchId)) {
        matchSubscribers.set(matchId, new Set());
    }

    matchSubscribers.get(matchId).add(socket);
}


export function sendJson(socket: WebSocket, payload: unknown) {

    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));

}

export function broadcast(wss: WebSocketServer, payload: unknown) {

    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(JSON.stringify(payload))
    }

}

export function attachWebSocketServer(server: Server) {


    const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 1024 * 1024 });

    server.on('upgrade', async (req, socket, head) => {
        const host = req.headers.host ?? "localhost";
        const url = req.url ?? "/";
        const { pathname } = new URL(url, `http://${host}`);

        if (pathname !== '/ws') {
            return;
        }

        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect({
                    method: req.method ?? "GET",
                    url: `http://${req.headers.host}${req.url}`,
                    headers: req.headers as Record<string, string>,
                },
                    { requested: 1 });

                if (decision.isDenied()) {
                    if (decision.reason.isRateLimit()) {
                        socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
                    } else {
                        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                    }
                    socket.destroy();
                    return;
                }
            } catch (e) {
                console.error('WS upgrade protection error', e);
                socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
                socket.destroy();
                return;
            }
        }

        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });


    wss.on("connection", async (socket: ExtendedWebSocket, req: ArcjetNodeRequest) => {
        socket.isAlive = true;
        socket.on("pong", () => { socket.isAlive = true });
        sendJson(socket, { type: 'welcome' });
        socket.on("error", console.error);
    })

    const interval = setInterval(() => {

        wss.clients.forEach((ws) => {

            const socket = ws as ExtendedWebSocket;
            if (socket.isAlive === false) return ws.terminate();
            socket.isAlive = false;
            socket.ping;

        })


    }, 30000);

    wss.on("close", () => { clearInterval(interval) });
    function broadcastMatchCreated(match: Match) {

        broadcast(wss, { type: 'match_created', data: match })

    }
    return { broadcastMatchCreated }
}