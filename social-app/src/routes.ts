import { Router } from 'express';
import  authRouter  from './modules/auth/route';
import  userRouter  from './modules/user/route';
import  postRouter  from './modules/post/route';
import  commentRouter  from './modules/comment/route';

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);

export default router;
