import express from "express";
import { CreateMatch, GetMatchData } from "../Controllers/MatchController.js";

const MatchRouter = express.Router()

MatchRouter.post("/create",CreateMatch);
MatchRouter.get("/get-match",GetMatchData);


export default MatchRouter; 