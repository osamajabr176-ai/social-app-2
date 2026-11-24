import { commentRepository } from "./comment.repository";
import { Icomment } from "../../lib/interface/interface";
import AppError from "../../lib/error/error";
import { postRepository } from "../post/post..repository";

class CommentService {
    constructor() {}
    async createComment(data: Icomment) {
        if(!data.PostId){
            throw new AppError("PostId is required to create a comment", 400);
        }
        if(!data.UserId){
            throw new AppError("UserId is required to create a comment", 400);
        }
        if(!data.content){
            throw new AppError("Content is required to create a comment", 400);
        }
        const post = postRepository.getPostById(data.PostId.toString());
        if(!post){
            throw new AppError("Post not found", 404);
        }
        return await commentRepository.createComment(data);
    }

    async getAllComments(postId:string) {
        const post = postRepository.getPostById(postId);
        if(!post){
            throw new AppError("Post not found", 404);
        }
        return await commentRepository.getAllComments(postId);
    }

    async getCommentById(commentId:string) {
        return await commentRepository.getCommentById(commentId);
    }


    async updateComment(commentId:string, data:Partial<Icomment>,userId:string) {

        if(!commentId){
            throw new AppError("CommentId is required to update a comment", 400);
        }
        if(!data.content){
            throw new AppError("Content is required to create a comment", 400);
        }
        const commentToUpdate = await commentRepository.getCommentById(commentId);
        if(!commentToUpdate){
            throw new AppError("Comment not found", 404);
        }
        if(commentToUpdate.UserId.toString() !== userId){
            throw new AppError("You are not allowed to update", 403);
        }
        return await commentRepository.updateComment(commentId, data);
    }
    async deleteComment(commentId:string,userId:string) {
        
        if(!commentId){
            throw new AppError("CommentId is required to delete a comment", 400);
        }

        const commentToDelete = await commentRepository.getCommentById(commentId);
        if(!commentToDelete){
            throw new AppError("Comment not found", 404);
        }

        if(commentToDelete.UserId.toString() !== userId){
            throw new AppError("You are not allowed to delete this comment", 403);
        }

        return await commentRepository.deleteComment(commentId);
    }
}

export const commentService = new CommentService();