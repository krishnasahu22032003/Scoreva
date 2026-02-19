import express from "express";
import startServer from "./utils/startserver.js";
import UserRouter from "./Routes/UserAuthRoutes.js";

const app = express();
app.use(express.json());


app.use("/api/user/",UserRouter);


startServer(app)