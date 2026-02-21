import WebSocket, { WebSocketServer } from "ws";
import { Server } from "http";
import type { Match } from "../../generated/prisma/index.js";

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

    wss.on("connection",(socket:ExtendedWebSocket)=>{
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