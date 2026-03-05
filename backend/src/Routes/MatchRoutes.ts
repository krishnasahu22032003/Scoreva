import express from "express";
import { CreateMatch, DeleteMatch, GetMatchData, GetMyMatches } from "../Controllers/MatchController.js";
import { AuthMiddleware  } from "../Middlewares/AuthMiddleware.js";
import { AdminMiddleware } from "../Middlewares/AdminMiddleware.js";

const MatchRouter = express.Router()

MatchRouter.post("/create",AuthMiddleware,AdminMiddleware,CreateMatch);
MatchRouter.get("/get-match",AuthMiddleware,GetMatchData);
MatchRouter.get(
  "/admin",
  AuthMiddleware,
  AdminMiddleware,
  GetMyMatches
);
MatchRouter.delete("/delete/:id", AuthMiddleware, AdminMiddleware, DeleteMatch);

export default MatchRouter; 