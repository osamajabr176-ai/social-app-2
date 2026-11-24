import { commentService } from "./comment..service";
import { Request, Response, NextFunction } from "express";

class CommentController {
    constructor() {}
    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            data.UserId = req.user?.id;
             // Assuming you have user information in the request object
            data.UserId = req.user?.id; // Assuming you have user information in the request object
             const createdComment = await commentService.createComment(data);
            res.status(201).json({
                message: 'Comment Created Successfully', success: true, data: createdComment,
            });
        }
        catch (error) {
            next(error);
        }
    }

    async getAllComments(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = req.params.id;
            const comments = await commentService.getAllComments(postId as string);
            res.json({
                message: 'Comments Retrieved Successfully', success: true, data: comments,
            });
        }
        catch (error) {
            next(error);
        }
    }

    async getCommentById(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = req.params.id;
            const comment = await commentService.getCommentById(commentId as string);
            res.json({
                message: 'Comment Retrieved Successfully', success: true, data: comment,
            });
        }
        catch(error) {
            next(error);
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {  
        try {
            const commentId = req.params.id;
            const data = req.body;
            const userId = req.user?.id
            const updatedComment = await commentService.updateComment(commentId as string, data,userId as string);
            res.json({
                message: 'Comment Updated Successfully', success: true, data: updatedComment,
            });
        } catch(error) {
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const commentId = req.params.id;
            const userId = req.user?.id
            const deletedComment = await commentService.deleteComment(commentId as string,userId as string);
            res.json({
                message:'Comment Deleted Successfully',success:true,data:deletedComment
            });
        } catch(error) {
            next(error);
        }
    }

}

export const commentController = new CommentController();
