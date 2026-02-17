import express from "express";
import startServer from "./utils/startserver.js";
import { WebSocketServer , WebSocket } from "ws";
import type { IncomingMessage } from "http";


//0:connecting , 1:open(send only if the connection is opened) , 2:closing , 3:closed

const wss = new WebSocketServer({ port:8080 });
const app = express();

app.use(express.json());

wss.on("connection", (socket:WebSocket , request:IncomingMessage)=>{

const ip = request.socket.remoteAddress;

socket.on("message",( rawData: Buffer)=>{
    console.log({rawdata:rawData});
    const message = rawData.toString();
    console.log(message)
    wss.clients.forEach((client)=>{
       
        if(client !== socket &&  client.readyState === WebSocket.OPEN ){
            client.send(`Server Broadcast ${message}`)
        }
    })
});

socket.on("error",( error )=>{

    console.error(`Server Error : ${error.message} : ${ip}`);
})

socket.on("close" , ()=>{
    console.log("Client disconnected")
})

})
console.log("websocket server is running")
startServer(app);