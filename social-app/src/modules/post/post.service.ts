import { postRepository } from "./post..repository";
import { Ipost } from "../../lib/interface/interface";
import AppError from "../../lib/error/error";

class PostService {
    
    constructor() {}

    createPost(data: Ipost,userId: string) {

        if(data.UserId.toString() !== userId ){
            throw new AppError("UserId is not allowed to create a post", 400);
        }
        if (!data.UserId) {
            throw new AppError("UserId is not allowed to create a post", 400);
        }
        return postRepository.createPost(data);
    }

    async getAllPosts(userId: string) {
        if (!userId) {
            throw new AppError("UserId is required to get posts", 400);
        }  
        let userPosts = await postRepository.getAllPosts(userId);
        if (!userPosts) {
            throw new AppError("No posts found for this user", 404);
        }
        return userPosts;
    }

    async getPostById(postId: string) {
        if (!postId) {
            throw new AppError("PostId is required to get a post", 400);
        }
        let posttoGet = await postRepository.getPostById(postId);
        if (!posttoGet) {
            throw new AppError("Post not found", 404);
        }
        else {
            return posttoGet;
        }
    }

    async updatePost(postId: string, data: Partial<Ipost>,userId :string) {
        if (!postId) {
            throw new AppError("PostId is required to update a post", 400);
        }
        if (!data) {
            throw new AppError("Data is required to update a post", 400);
        }
     
        let posttoUpdate = await postRepository.getPostById(postId);
        let Id = posttoUpdate?.UserId.toString();
        if (Id !== userId) {
            throw new AppError("You are not allowed to update",403);
        }
        if (!posttoUpdate) {
            throw new AppError("Post not found", 404);
        }
        return postRepository.updatePost(postId,data);
    }

    async deletePost(postId: string,userId:string) {
        if (!postId) {
            throw new AppError("PostId is required to delete a post", 400);
        }
        if (!userId) {
            throw new AppError("UserId is required to delete a post", 400);
        }
        
        let posttoDelete = await postRepository.getPostById(postId);
        
        if (!posttoDelete) {
            throw new AppError("Post not found", 404);
        }
        if(posttoDelete.UserId.toString() !== userId){
            throw new AppError("You are not allowed to delete this post", 403);
        }
        return postRepository.deletePost(postId);
    }
}

export const postService = new PostService();
