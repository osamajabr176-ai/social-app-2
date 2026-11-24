import userRepository from "./user.repository";

import  AppError  from "../../lib/error/error";
import { ICloudProvider } from "../../pkg/cloud/cloud.interface";
import { s3CloudProvider } from "../../lib/cloud/cloud.init";

export class userService {

    private readonly cloudProvider:ICloudProvider=s3CloudProvider;
    
    constructor() {}

    async getUserByEmail(email: string) {
        return userRepository.findByEmail(email);
    }


    async followUser(followerId:string, followingId:string) {

    if (followerId.toString() === followingId.toString()) {
        throw new AppError('You cannot follow yourself', 400);
    }

    const follower = await  userRepository.findUserById(followerId);
    const following = await userRepository.findUserById(followingId);

    if (!follower || !following) {
        throw new AppError('User not found', 404);
    }

    const existingFollow = await userRepository.findFollow(
        followerId,
        followingId
    );

    if (existingFollow) {
        throw new AppError('You already follow this user', 400);
    }

    return await userRepository.createFollow(
        followerId,
        followingId
    );
}

async unfollowUser(followerId:string, followingId:string) {

    const existingFollow = await userRepository.findFollow(
        followerId,
        followingId
        );
    if (!existingFollow) {
        throw new AppError('You are not following this user', 400);
        }

    return await userRepository.deleteFollow(
        followerId,
        followingId
        );
    }

    async searchUsersService(search: string, userId: string) {

    if (!search || search.trim().length < 2) {
        throw new AppError('Enter at least 2 characters', 400);
    }

    return await userRepository.searchUsers(search, userId);
}

async updatePrivacyService(userId:string, isPrivate:boolean) {

    if (typeof isPrivate !== 'boolean') {
        throw new AppError('isPrivate must be a boolean', 400);
    }

    const user = await userRepository.updatePrivacy(userId, isPrivate);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
}

uploadProfilePicture = async (userId:string, file: Express.Multer.File) => {
    
        const result = await this.cloudProvider.uploadFile(file, `profile-pictures/users/${userId}`);
    
        await userRepository.uploadProfilePicture(userId, result);
        return result;
    }

    uploadProfilePicturePresignedUrl = async (userId:string, file: Express.Multer.File) => {
    
    const presignedUrl = await this.cloudProvider.generatePresignedUrl(file, `profile-pictures/${userId}`);
    return presignedUrl;
    }
    deleteProfilePicture = async (userId:string) => {
        const user = await userRepository.findUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        if (user.profilePicture) {
            await this.cloudProvider.deleteFile(user.profilePicture);
        }
        await userRepository.deleteProfilePicture(userId);
    }
}
export default new userService();