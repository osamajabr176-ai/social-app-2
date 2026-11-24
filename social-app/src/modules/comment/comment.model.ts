import {model, Schema, Types} from "mongoose";
import { Icomment } from "../../lib/interface/interface";

const commentSchema = new Schema<Icomment>({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    UserId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    PostId: {
        type: Types.ObjectId,
        ref: "Post",
        required: true
    },
    recactionsCount: {
        type: Number,
        default: 0
    },
    replyTo: {
        type: Types.ObjectId,
        ref: "Comment",
        default: null
    },
    mentions: [{
        type: Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true }
);

export const comment = model<Icomment>("Comment", commentSchema);