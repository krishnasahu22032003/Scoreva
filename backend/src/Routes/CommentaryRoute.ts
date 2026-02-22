import express from "express";
import { Commentary, GetCommentary } from "../Controllers/CommentaryController.js";

const CommentaryRouter = express.Router();

CommentaryRouter.get("/:id",GetCommentary)
CommentaryRouter.post("/",Commentary)

export default CommentaryRouter;