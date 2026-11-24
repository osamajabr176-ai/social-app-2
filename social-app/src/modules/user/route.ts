import {Router} from 'express';
import  userController  from './user.controller';
import { multerUpload, multerUploadSingle } from '../../lib/media/multer';
import { authGuard } from '../../lib/middleware/authGuard';

const userRouter = Router();
userRouter.get('/getUserByEmail', userController.getUserByEmail);
userRouter.post('/follow', userController.followUser);
userRouter.post('/unfollow', userController.unfollowUser);
userRouter.get('/search', userController.searchUsersController);
userRouter.post('/updatePrivacy', userController.updatePrivacyController);
userRouter.post('/deleteProfilePicture', authGuard, userController.deleteProfilePictureController);
userRouter.post('/uploadProfilePicture',multerUploadSingle("profilePicture"),userController.uploadProfilePictureController);
userRouter.post('/uploadProfilePicturePresignedUrl',authGuard,userController.uploadProfilePicturePresignedUrl);

export default userRouter;