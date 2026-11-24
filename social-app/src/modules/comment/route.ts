import { Router } from "express";
import { commentController } from "./comment.controller";
import { authGuard } from "../../lib/middleware/authGuard";

const commentRouter = Router();

commentRouter.post("/create", authGuard, commentController.createComment);
commentRouter.get("/get-comment-by-id/:id",commentController.getCommentById);
commentRouter.get("/all-comments/:id",authGuard,commentController.getAllComments);
commentRouter.delete("/delete/:id",authGuard,commentController.deleteComment);
commentRouter.put("/update/:id",authGuard,commentController.updateComment);


export default commentRouter;