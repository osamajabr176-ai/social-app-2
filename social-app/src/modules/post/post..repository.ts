import { Ipost } from "../../lib/interface/interface";
import { AbstractRpository } from "../../lib/db/db.abstract";
import  {post}  from "./model/model";


class PostRepository extends AbstractRpository<Ipost> {

constructor() {
   super(post);
}

   createPost(data: Ipost) {
      return post.create(data);
   }

   getAllPosts(userId: string) {
      return this.model.find({ UserId: userId });
   }

   getPostById(postId: string) {
      return this.model.findById(postId);
   }

   updatePost(postId: string, data: Partial<Ipost>) {
      return this.model.findByIdAndUpdate(postId, data, { returnDocument: "after" });
   }

   deletePost(postId: string) {
      return this.model.findByIdAndDelete(postId);
   }


}
export const postRepository = new PostRepository();