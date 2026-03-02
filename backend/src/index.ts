import express from "express";
import startServer from "./utils/startserver.js";
import UserRouter from "./Routes/UserAuthRoutes.js";
import MatchRouter from "./Routes/MatchRoutes.js";
import { securityMiddleware } from "./arcjet.js";
import CommentaryRouter from "./Routes/CommentaryRoute.js";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({origin: "http://localhost:3000",credentials:true}))
app.use(express.json());
app.use(cookieParser())
// app.use(securityMiddleware)

app.use("/api/user/",UserRouter);
app.use("/api/match/",MatchRouter);
app.use("/api/commentary",CommentaryRouter)


startServer(app)