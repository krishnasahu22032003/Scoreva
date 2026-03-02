import express from "express";
import { Commentary, GetCommentary } from "../Controllers/CommentaryController.js";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware.js";
import { AdminMiddleware } from "../Middlewares/AdminMiddleware.js";

const CommentaryRouter = express.Router();

CommentaryRouter.get("/:id",AuthMiddleware,GetCommentary)
CommentaryRouter.post("/create/:id",AuthMiddleware,AdminMiddleware,Commentary)

export default CommentaryRouter;