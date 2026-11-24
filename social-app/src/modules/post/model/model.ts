import { model, Schema, Types } from "mongoose";
import { Ipost } from "../../../lib/interface/interface";

const schema = new Schema<Ipost>({
    content : {
    type : String ,
    required : true ,
    trim : true ,
    minlength : 1 ,
    maxlength : 200 

    } ,
    UserId : {
        type : Types.ObjectId ,
        ref : 'User' ,
        required :true
    },
    commentsCount : {
        type     : Number ,
        default :0
    },
    reactionsCount : {
        type : Number,
        default : 0
    }
})
export const post = model("Post" ,schema) ;