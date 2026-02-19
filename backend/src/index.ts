import express from "express";
import { WebSocketServer } from "ws";
import startServer from "./utils/startserver.js";
import type { IncomingMessage } from "http";

const app = express();
app.use(express.json());


const wss = new WebSocketServer({port:8080});


wss.on("connection",(socket , request)=>{

console.log("connected to ws server");

const ip = request.socket.remoteAddress ; 

socket.on("message",(message:Buffer)=>{

const data  = message.toString();
console.log(data)

wss.clients.forEach((client)=>{

if(client !== socket && client.readyState === WebSocket.OPEN){

    client.send(data)
}

})

})

socket.on("error",(error)=>{

    console.error(`Error Came ${error}, ip:${ip}`)


})
socket.on("close",()=>{
    console.log("disconnected")
})
})
startServer(app)