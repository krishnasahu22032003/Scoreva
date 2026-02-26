import express from "express";
import { CreateMatch, GetMatchData, GetMyMatches } from "../Controllers/MatchController.js";
import { AuthMiddleware  } from "../Middlewares/AuthMiddleware.js";
import { AdminMiddleware } from "../Middlewares/AdminMiddleware.js";

const MatchRouter = express.Router()

MatchRouter.post("/create",AuthMiddleware,AdminMiddleware,CreateMatch);
MatchRouter.get("/get-match",AuthMiddleware,GetMatchData);
MatchRouter.get(
  "/my",
  AuthMiddleware,
  AdminMiddleware,
  GetMyMatches
);


export default MatchRouter; 