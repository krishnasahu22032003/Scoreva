import express from "express";
import startServer from "./utils/startserver.js";
import UserRouter from "./Routes/UserAuthRoutes.js";
import MatchRouter from "./Routes/MatchRoutes.js";
import { securityMiddleware } from "./arcjet.js";

const app = express();
app.use(express.json());
app.use(securityMiddleware)

app.use("/api/user/",UserRouter);
app.use("/api/match/",MatchRouter);



startServer(app)