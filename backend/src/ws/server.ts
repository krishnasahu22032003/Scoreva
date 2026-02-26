import WebSocket, { WebSocketServer, type RawData } from "ws";
import { Server } from "http";
import type { Match } from "../../generated/prisma/index.js";
import { wsArcjet } from "../arcjet.js";
import type { ArcjetNodeRequest } from "@arcjet/node";

export interface ExtendedWebSocket extends WebSocket {

    isAlive: boolean,
    subscriptions:Set<number>;

}

const matchSubscribers = new Map<number, Set<WebSocket>>()

function subscribe(matchId: number, socket: WebSocket) {
    let subscribers = matchSubscribers.get(matchId);

    if (!subscribers) {
        subscribers = new Set<WebSocket>();
        matchSubscribers.set(matchId, subscribers);
    }

    subscribers.add(socket);
}

function unsubscribe(matchId:number, socket:WebSocket) {
    const subscribers = matchSubscribers.get(matchId);

    if(!subscribers) return;

    subscribers.delete(socket);

    if(subscribers.size === 0) {
        matchSubscribers.delete(matchId);
    }
}

function cleanupSubscriptions(socket:ExtendedWebSocket) {
  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
}
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

function broadcastToMatch(matchId:number, payload:any) {
    const subscribers = matchSubscribers.get(matchId);
    if(!subscribers || subscribers.size === 0) return;

    const message = JSON.stringify(payload);

    for(const client of subscribers) {
        if(client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}


function handleMessage(socket:ExtendedWebSocket, data:RawData) {
    let message;

    try {
        message = JSON.parse(data.toString());
    } catch {
        sendJson(socket, { type: 'error', message: 'Invalid JSON' });
        return;
    }

    if(message?.type === "subscribe" && Number.isInteger(message.matchId)) {
        subscribe(message.matchId, socket);
        socket.subscriptions.add(message.matchId);
        sendJson(socket, { type: 'subscribed', matchId: message.matchId });
        return;
    }

    if(message?.type === "unsubscribe" && Number.isInteger(message.matchId)) {
        unsubscribe(message.matchId, socket);
        socket.subscriptions.delete(message.matchId);
        sendJson(socket, { type: 'unsubscribed', matchId: message.matchId });
    }
}

export function attachWebSocketServer(server: Server) {


    const wss = new WebSocketServer({ noServer:true, maxPayload: 1024 * 1024 });

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
        socket.subscriptions = new Set();
        sendJson(socket, { type: 'welcome' });
  

        socket.on('message', (data) => {
            handleMessage(socket, data);
        });

        socket.on('error', (err) => {
            console.error(err);
            socket.terminate();
        });

        socket.on('close', () => {
            cleanupSubscriptions(socket);
        })
       
    })

    const interval = setInterval(() => {

        wss.clients.forEach((ws) => {

            const socket = ws as ExtendedWebSocket;
            if (socket.isAlive === false) return ws.terminate();
            socket.isAlive = false;
            socket.ping();

        })
    }, 30000);

    wss.on("close", () => { clearInterval(interval) });
    function broadcastMatchCreated(match: Match) {

        broadcast(wss, { type: 'match_created', data: match })

    }
  function broadcastCommentary(matchId:number, comment:string) {
        broadcastToMatch(matchId, { type: 'commentary', data: comment });
    }

    return { broadcastMatchCreated , broadcastCommentary}
}