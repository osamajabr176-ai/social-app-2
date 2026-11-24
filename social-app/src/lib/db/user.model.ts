import { model, Schema } from "mongoose";
import { gender, provider } from "../enum/enum";
import { IUser } from "../interface/interface";

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: function (this: any) {
            return this.provider === provider.Local || this.provider === 'local';
        },
        trim: true,
    },
    gender: {
        type: String,
        enum: Object.values(gender),
    },
    provider: {
        type: String,
        default: 'local'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    twoStepVerification: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
    type: String,
    default: null
},
resetPasswordExpires: {
    type: Date,
    default: null
},
isPrivate: {
    type: Boolean,
    default: false
},
profilePicture: {
    type: String,
    default: null
},
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
