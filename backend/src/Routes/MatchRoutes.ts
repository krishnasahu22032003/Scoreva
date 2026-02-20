import express from "express";
import { CreateMatch } from "../Controllers/MatchController.js";

const MatchRouter = express.Router()

MatchRouter.post("/create",CreateMatch)


export default MatchRouter; 