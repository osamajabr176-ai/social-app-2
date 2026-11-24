import {Router} from "express";
import { postController } from "./post.controller";
import  {authGuard}  from "../../lib/middleware/authGuard";
import {uploadPic} from "../../lib/middleware/uploadPic";

const postRouter = Router();

postRouter.post("/create", authGuard,uploadPic, postController.createPost);
postRouter.get("/get-post-by-id/:id",postController.getPostById);
postRouter.get("/all-posts",authGuard,postController.getAllPosts);
postRouter.delete("/delete/:id",authGuard,postController.deletePost);
postRouter.put("/update/:id",authGuard,postController.updatePost);

export default postRouter;