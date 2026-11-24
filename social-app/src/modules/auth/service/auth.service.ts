import { registerDto } from "../../../dto/dto";
import { IUser } from "../../../lib/interface/interface";
import userRepository, { UserRepository } from "../../user/user.repository";
import authRepository from "../repository/auth.repository";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../util";
import { userAlreadyExist, userNotExist, userAlreadyVerified, userNotVerified } from "../../user/error";
import { otpExpired, invalidCode, invalidPassword } from "../error";
import { generateOTPCode } from "../../../lib/utils/otp";
import { cacheprovider } from "../../../lib/cache/init";
import { INotificationProvider } from "../../../pkg/email/mail.interface";
import { nodemailerprovider } from "../../../pkg/email/nodemailer";
import { toSeconds } from "../../../pkg/utils/time";
import { verifyGoogletoken } from "../../../lib/utils/google-auth";
import { AppError } from "../../../lib/error/error";
import jwt from "jsonwebtoken";
import { env } from "../../../lib/config/env";

class AuthService {
    private twoStepVerificationKey = '2-step-verificatin:';
    private sendOtpKey = 'otp:';
    private readonly userRepository: UserRepository = userRepository;
    private readonly authRepository = authRepository;
    private readonly mailProvider: INotificationProvider;

    constructor() {
        this.mailProvider = nodemailerprovider;
    }

    async register(registerData: registerDto) {
        // 1. check user existence
        const userExist = await this.userRepository.findByEmail(registerData.email);
        // 2. if yes, throw an error.
        if (userExist) throw userAlreadyExist;

        // 3. prepare data [hash-password]
        registerData.password = await hashPassword(registerData.password);

        // 4. save user into DB -> isVerified: false
        const createdUser = await this.userRepository.create(registerData);

        // 5. generate and save otp into cache
        const code = generateOTPCode();
        await cacheprovider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));

        // 6. send email verification OTP
        await this.mailProvider.send(registerData.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
        return createdUser;
    }

    async verifyAccount(email: string, code: string) {
        // 1. check user existence
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;
        if (user.isVerified === true) throw userAlreadyVerified;

        // 2. check otp validation
        const cacheCode = await cacheprovider.get(`${this.sendOtpKey}${user._id!.toString()}`);
        if (!cacheCode) throw otpExpired;
        if (cacheCode !== code) throw invalidCode;

        // 3. Switch isVerified to true
        const updatedUser = await this.userRepository.updateUserByEmail(email, { isVerified: true });

        // 4. delete otp from cache
        await cacheprovider.del(`${this.sendOtpKey}${user._id!.toString()}`);

        return updatedUser;
    }

    async enable2StepVerification(email: string) {
        const code = generateOTPCode();
        await cacheprovider.set(`${this.twoStepVerificationKey}${email}`, code, toSeconds(3, 'minutes'));
        await this.mailProvider.send(email, '2 step verification code', `your 2 step verification code is ${code}`);
    }

    async verifyCodeActiveTwoStepVerification(email: string, code: string) {
        // 1. check user existence
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;

        // 2. check otp validation
        const cacheCode = await cacheprovider.get(`${this.twoStepVerificationKey}${email}`);
        if (!cacheCode) throw otpExpired;
        if (cacheCode !== code) throw invalidCode;

        // 3. update user
        await this.userRepository.updateUserByEmail(email, { twoStepVerification: true });

        // 4. delete otp from cache
        await cacheprovider.del(`${this.twoStepVerificationKey}${email}`);
    }

    async login(email: string, password: string) {
        // check cache attempts
        const cachedAttempt = await cacheprovider.get(`${email}:login`);
        if (cachedAttempt === '0') throw new AppError('you reach max tries', 429);

        // 1. check user existence
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;
        if (user.isVerified === false) throw userNotVerified;

        // 2. compare password
        const match = await comparePassword(password, user.password || '');
        if (!match) throw invalidPassword;

        if (user.twoStepVerification === true) {
            const code = generateOTPCode();
            await cacheprovider.set(`${this.twoStepVerificationKey}${email}`, code, toSeconds(1, 'minutes'));
            await this.mailProvider.send(email, '2 step verification code', `<h3>your code is ${code}</h3>`);
            return;
        }

        // 3. generate access Token
        const accessToken = generateAccessToken({ id: user._id, name: user.userName });
        const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });

        const ttlRemaining = await cacheprovider.ttl(`${email}:login`);
        const attempts = cachedAttempt ? parseInt(cachedAttempt, 10) : 5;
        const ttl = ttlRemaining === -2 ? toSeconds(3, 'minutes') : ttlRemaining;
        await cacheprovider.set(`${email}:login`, (attempts - 1).toString(), ttl);

        return {
            accessToken,
            refreshToken
        };
    }

    async verifyCodeTwoStepVerification(email: string, code: string) {
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;

        const cacheCode = await cacheprovider.get(`${this.twoStepVerificationKey}${email}`);
        if (!cacheCode) throw otpExpired;
        if (cacheCode !== code) throw invalidCode;

        const accessToken = generateAccessToken({ id: user._id, name: user.userName });
        const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });
        await cacheprovider.del(`${this.twoStepVerificationKey}${email}`);

        return { accessToken, refreshToken };
    }

    async sendOtp(email: string) {
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;

        const code = generateOTPCode();
        await cacheprovider.set(`${this.sendOtpKey}${user._id!.toString()}`, code, toSeconds(3, 'minutes'));
        await this.mailProvider.send(email, 'new otp', `<p>your new otp is ${code}</p>`);
    }

    async resetPassword(email: string, code: string, newPassword: string) {
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;

        const otp = await cacheprovider.get(`${this.sendOtpKey}${user._id!.toString()}`);
        if (!otp) throw otpExpired;
        if (otp !== code) throw invalidCode;

        const hashedPassword = await hashPassword(newPassword);
        await this.userRepository.updateUserByEmail(email, { password: hashedPassword });
        await cacheprovider.del(`${this.sendOtpKey}${user._id!.toString()}`);
    }

    async loginWithGoogle(idToken: string) {
        const payload = await verifyGoogletoken(idToken);
        if (!payload || !payload.email) throw new AppError('invalid google payload', 400);

        const user = await this.authRepository.checkUserExistByEmail(payload.email);
        if (user) {
            return generateAccessToken({
                id: user._id,
                email: user.email,
                name: user.userName
            });
        }

        const createdUser = await this.authRepository.createUser({
            userName: payload.name || payload.email.split('@')[0],
            email: payload.email,
            provider: 'google',
            isVerified: true,
        });

        return generateAccessToken({
            id: createdUser._id,
            email: createdUser.email,
            name: createdUser.userName
        });
    }

    async resetPasswordRequest(email: string) {
        const user = await this.authRepository.checkUserExistByEmail(email);
        if (!user) throw userNotExist;

        const token = generateAccessToken({ id: user._id, email: user.email });
        authRepository.updateUserByEmail(email, { resetPasswordToken: token, resetPasswordExpires: new Date(Date.now() + toSeconds(15, 'minutes') * 1000) });
        await this.mailProvider.send(email, 'reset password code', `<p>your reset password code is ${token}</p>`);
    }

    async resetPasswordWithToken(email: string, token: string, newPassword: string) {
        const payload = jwt.verify(token, env.jwt.secret) as any;
        const user = await this.authRepository.checkUserExistByEmail(payload.email);
        if (!user) throw userNotExist;
        
        console.log('user.resetPasswordToken', user.resetPasswordToken);
        console.log('user.resetPasswordExpires', user.resetPasswordExpires);
        console.log(payload.email, email);
        console.log("password", newPassword);

        if (user.resetPasswordToken !== token || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new AppError('invalid or expired reset password token', 400);
        }

        const hashedPassword = await hashPassword(newPassword);
        await this.authRepository.updateUserByEmail(payload.email, { password: hashedPassword, resetPasswordToken: "", resetPasswordExpires: new Date(0) });
    }

    async refreshToken(token: string) {
        const payload = jwt.verify(token, env.jwt.refreshSecret) as any;
        const accessToken = generateAccessToken({ id: payload.id, name: payload.name });
        const refreshToken = generateRefreshToken({ id: payload.id, name: payload.name });
        return {
            accessToken,
            refreshToken
        };
    }

    async refreshTokenFn(token: string) {
        return this.refreshToken(token);
    }
}

export default new AuthService();
