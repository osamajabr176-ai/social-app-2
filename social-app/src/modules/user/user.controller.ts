import { Request, Response,NextFunction } from "express";
import  userService  from "./user.service";

export class userController {

    constructor(){}

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.getUserByEmail(req.body.email);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async followUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { followerId, followingId } = req.body;
            const follow = await userService.followUser(followerId, followingId);
            res.json(follow);
        } catch (error) {
            next(error);
        }
    }

    async unfollowUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { followerId, followingId } = req.body;
            const unfollow = await userService.unfollowUser(followerId, followingId);
            res.json(unfollow);
        } catch (error) {
            next(error);
        }
    }

    async searchUsersController(req: Request, res: Response, next: NextFunction) {
    try {

        const { search } = req.query;
        const {userId} = req.body;
        const searchString = search as string;
        console.log('searchString:', searchString);
        console.log('userId:', userId);
        const users = await userService.searchUsersService(searchString, userId);

        return res.status(200).json({
            message: 'Search completed successfully',
            results: users.length,
            data: users
        });

    } catch (error) {
        next(error);
        }
    }



    async updatePrivacyController(req: Request, res: Response, next: NextFunction) {
    try {

        const { userId, isPrivate } = req.body;
        
        const user = await userService.updatePrivacyService(
            userId,
            isPrivate
        );

        return res.status(200).json({
            message: 'Privacy settings updated successfully',
            data: user
        });

    } catch (error) {
        next(error);
        }
    }

    async uploadProfilePictureController(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('req.user:', req.user);
        console.log('req.file:', req.file);
        const  userId = req.user?.id;
        const file = req.file;
        const result = await userService.uploadProfilePicture("6afb5e7e2ede3281fb26ec3a", file as Express.Multer.File);
        return res.status(200).json({
            message: 'Profile picture uploaded successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

    async deleteProfilePictureController(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('req.user:', req.user);
        const userId = req.user?.id;
        await userService.deleteProfilePicture(userId as string);
        return res.status(200).json({
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

uploadProfilePicturePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {fileName,contentType} = req.body;
        const userId = req.user?.id;
        if (!fileName || !contentType) {
            return res.status(400).json({ message: 'No file provided' });
        }
        const presignedUrl = await userService.uploadProfilePicturePresignedUrl(userId as string, { originalname: fileName, mimetype: contentType } as Express.Multer.File);
        return res.status(200).json({
            message: 'Profile picture presigned URL generated successfully',
            data: presignedUrl
        });
    } catch (error) {
        next(error);
        }
    }
}
export default new userController();