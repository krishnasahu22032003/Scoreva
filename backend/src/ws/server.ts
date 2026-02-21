import WebSocket, { WebSocketServer } from "ws";
import { Server } from "http";
import type { Match } from "../../generated/prisma/index.js";
import { wsArcjet } from "../arcjet.js";
import type { ArcjetNodeRequest } from "@arcjet/node";

export interface ExtendedWebSocket extends WebSocket{

isAlive:Boolean

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

    
    const wss = new WebSocketServer({ server, path: '/ws' , maxPayload:1024 * 1024  });

    wss.on("connection",async (socket:ExtendedWebSocket ,req:ArcjetNodeRequest)=>{
        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect(req , {requested:1});

                if (decision.isDenied()) {
                  const code = decision.reason.isRateLimit() ? 1013 :1008 ;
                  const reason = decision.reason.isRateLimit() ? "rate limit exceeded" : "access denied" ;
                  socket.close(code , reason);
                  return ;
                }
            } catch (e) {
                console.error('WS upgrade protection error', e);
                socket.close(1011,"Server Security error");
                return;
            }
        }
        socket.isAlive = true;
        socket.on("pong",()=>{socket.isAlive = true });
        sendJson(socket,{type:'welcome'});
        socket.on("error",console.error);
    })

const interval = setInterval(() => {

    wss.clients.forEach((ws)=>{
            
    const socket = ws as ExtendedWebSocket;
      if(socket.isAlive === false) return ws.terminate();
    socket.isAlive = false;
    socket.ping;

    })
  

}, 30000);

wss.on("close",()=>{clearInterval(interval)});
function broadcastMatchCreated(match:Match){

broadcast(wss,{type:'match_created',data:match})

}
return {broadcastMatchCreated}
}