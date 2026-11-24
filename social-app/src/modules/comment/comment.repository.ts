import { Icomment } from "../../lib/interface/interface";
import { AbstractRpository } from "../../lib/db/db.abstract";
import { comment } from "./comment.model";

class CommentRepository extends AbstractRpository<Icomment> {
    constructor() {
        super(comment);
    }
    async createComment(data: Icomment) {
        return comment.create(data);
    }

    async getAllComments(postId:string){
        return comment.find({PostId:postId});
    }


    async getCommentById(commentId: string) {
        return comment.findById(commentId);
    }

    async updateComment(commentId:string,data:Partial<Icomment>){
        return comment.findByIdAndUpdate(commentId,data,{returnDocument:"after"})
    }

    async deleteComment(commentId:string){
        return comment.findByIdAndDelete(commentId);
    }

}

export const commentRepository = new CommentRepository();