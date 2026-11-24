import { Router } from "express";
import authController from "./controller/auth.controller";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/reset-password-request', authController.resetPasswordRequest);
authRouter.post('/reset-password-by-token', authController.verifyResetPasswordToken);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
export default authRouter;