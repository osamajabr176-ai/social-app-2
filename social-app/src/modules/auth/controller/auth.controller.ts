import { NextFunction, Request, Response } from "express";
import authService from "../service/auth.service";
import { setCookies } from "../util";
import { toMs } from "../../../pkg/utils/time";

class AuthController { 
    constructor() {}
    async register(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body // validateBody(registerDTO, req.body);
        console.log(data);
        const createdUser = await authService.register(data);
        res.status(201).json({
        message: 'User Created Successfully', success: true, data: createdUser,
});
} catch (error) {
        next(error);
    }
}

async verifyAccount(req: Request, res: Response, next: NextFunction) {

    try {

const data = req.body // validateBody(verifyAccountDTO, req.body);
const { email, code } = data;

const updatedUser = await authService.verifyAccount(email, code);
res.json({
message: 'User Verified Successfully', success: true, data: updatedUser,
});
} catch (error) {
next(error);
}
}

async login(req: Request, res: Response, next: NextFunction) {
    try {
    const data = req.body // validateBody(loginDTO, req.body);
    const { email, password } = data
    const tokens = await authService.login(email, password);
    if (!tokens) return res.json({ message: "otp sent", success: true });

    setCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({message: 'User Login Successfully', success: true,});
    } catch (error) {
            next(error);
        }
}

async sendOtp(req: Request, res: Response, next: NextFunction) {
try {
const data = req.body // validateBody(sendOTPDto, req.body);
const { email } = data;
await authService.sendOtp(email);
res.json({ message: "new otp sent,check user email", success: true });
} catch (err) {
next(err);
}

}

async resetPassword(req: Request, res: Response, next: NextFunction) {
try {
const data = req.body // validateBody(resetPasswordDTO, req.body);
const { email, code, newPassword } = data;
await authService.resetPassword(email, code, newPassword);
res.json({
message: "password reset successfully",
success: true,
});
} catch (error) {
next(error);
}
}

async resetPasswordRequest(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.resetPasswordRequest(req.body.email);
            res.json({ message: "reset password code sent to your email", success: true });
        } catch (error) {
            next(error);
        }
    }

async verifyResetPasswordToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, token,newPassword } = req.body;
            await authService.resetPasswordWithToken(email, token, newPassword);
            res.json({ message: "reset password token verified successfully", success: true });
        } catch (error) {
            next(error);
        }
    }

async loginWithGoogle(req: Request, res: Response, next: NextFunction) {
try {
const token = await authService.loginWithGoogle(req.body.idToken);
res.cookie('access_token', token, {
httpOnly: true, maxAge: toMs(1, 'hours'),
});
res.json({ message: "user login successfully", success: true });
} catch (error) {
next(error)
}
}

async refreshToken(req: Request, res: Response, next: NextFunction) {
try {
const { accessToken, refreshToken } = await authService.refreshTokenFn(req.cookies.refresh_token);
setCookies(res, accessToken, refreshToken)
res.json({
message: "refresh token successfully",
success: true,
data: { accessToken, refreshToken }
});

} catch (error) {
next(error);
}
}

async enable2StepVerification(req: Request, res: Response, next: NextFunction) {
try {
await authService.enable2StepVerification(req.body.email);
res.json('OK');
} catch (error) {
next(error);
}
}


async verifyCodeActiveTwoStepVerification(req: Request, res: Response, next: NextFunction) {
try {
await authService.verifyCodeActiveTwoStepVerification(req.body.email, req.body.code);
res.json('OK');
} catch (error) {
next(error);
}
}

async verifyCodeTwoStepVerification(req: Request, res: Response, next: NextFunction) {
try {
    const { accessToken, refreshToken } = await authService.verifyCodeTwoStepVerification(req.body.email, req.body.code);
    setCookies(res, accessToken, refreshToken);
    res.json('ok');
    } catch (error) {
            next(error);
        }
    }

}



export default new AuthController();
