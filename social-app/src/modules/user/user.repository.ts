import { AbstractRpository } from "../../lib/db/db.abstract";
import { User } from "../../lib/db/user.model";
import { IUser } from "../../lib/interface/interface";
import { Follow } from '../../lib/db/follow.model';

export class UserRepository extends AbstractRpository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string) {
        return this.model.findOne({ email }, { password: 0 });
    }

    async checkUserExistByEmail(email: string) {
        return this.model.findOne({ email });
    }

    async updateUserByEmail(email: string, update: Partial<IUser>) {
        return this.model.findOneAndUpdate({ email }, update, { new: true });
    }
    
    async createFollow(follower: string, following: string) {
    return await Follow.create({
        follower,
        following
    });
}

    async deleteFollow(follower: string, following: string) {
    return await Follow.deleteOne({
        follower,
        following
    });
}

    async findFollow(follower: string, following: string) {
    return await Follow.findOne({
        follower,
        following
    });
}

    async getFollowers(userId: string) {
    return await Follow.find({
        following: userId
    }).populate('follower', 'name email');
}

    async getFollowing(userId: string) {
    return await Follow.find({
        follower: userId
    }).populate('following', 'name email');
}

    async countFollowers(userId: string) {
    return await Follow.countDocuments({
        follower: userId
    });
}

async findFollowers(userId: string) {
    return await Follow.find({
        following: userId
        }).populate('follower', 'name email');
    }

async findUserById(userId: string) {
    return await this.model.findById(userId);
    }

    async searchUsers(search: string, userId: string) {


    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

    return await User.find({
        _id: { $ne: userId },
        $and: [
            {
                $or: [
                    { userName: { $regex: safeSearch, $options: 'i' } }
                ]
            },
            
        ]
    })
    .select('userName email')
    .limit(10);
}

async updatePrivacy(userId:string, isPrivate:boolean) {
    return await User.findByIdAndUpdate(
        userId,
        { isPrivate },
        { returnDocument: 'after' }
        ).select('userName isPrivate');
    }
    async updateUserById(userId: string, update: Partial<IUser>) {
        return this.model.findByIdAndUpdate(userId, update, { returnDocument: 'after' });
    }

    async uploadProfilePicture(userId:string,path: string) {
        
    
        await this.updateUserById(userId, { profilePicture: path });
        return path;
    }
    deleteProfilePicture = async (userId:string) => {
        await this.updateUserById(userId, { profilePicture: "" });
    }
}


export default new UserRepository();
