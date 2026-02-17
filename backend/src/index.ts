import express from "express";
import startServer from "./utils/startserver.js";

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("ws project")
})


startServer(app);