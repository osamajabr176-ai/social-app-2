import { AppError } from "../error/error.js";
import jwt from "jsonwebtoken";
import { env } from '../config/env';
import { Request , Response ,NextFunction} from "express";

export function authGuard(req :Request, res :Response, next :NextFunction) {
    try {
        // logic of check token
        const token = req.cookies.access_token;
        // "access_toke=ekshfjfbgihbzsdg;hamada=hambozo;ka3bora=rabe3;"
        if (!token) throw new AppError('no token provided', 403);
        req.user = jwt.verify(token, env.jwt.secret) as {id :string ,email :string , role :string};
        // req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
}  