import express from "express";
import { GetCommentary } from "../Controllers/CommentaryController.js";

const CommentaryRouter = express.Router();

CommentaryRouter.get("/:id",GetCommentary)

export default CommentaryRouter;