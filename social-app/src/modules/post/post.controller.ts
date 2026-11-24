import { postService } from "./post.service";
import { Request, Response, NextFunction } from "express";

class PostController {
    constructor() {}

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const userId = req.user?.id;
            const key = req.pic;
            const createdPost = await postService.createPost(data,userId as string);
            res.status(201).json({

                message: 'Post Created Successfully', success: true, data: createdPost,url:key
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id; 
            const posts = await postService.getAllPosts(userId as string);
            res.json({
                message: 'Posts Retrieved Successfully', success: true, data: posts,
            });
        } catch (error) {
            next(error);
        }
    }

    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const postId = req.params.id as string;
            const post = await postService.getPostById(postId);
            res.json({
                message: 'Post Retrieved Successfully', success: true, data: post,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const postId = req.params.id as string;
            const data = req.body;
            const updatedPost = await postService.updatePost(postId, data,userId as string);
            res.json({
                message: 'Post Updated Successfully', success: true, data: updatedPost,
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const postId = req.params.id as string;
            const deletedPost = await postService.deletePost(postId, userId as string);
            res.json({
                message: 'Post Deleted Successfully', success: true, data: deletedPost,
            });
        } catch (error) {
            next(error);
        }
    }

}
export const postController = new PostController();