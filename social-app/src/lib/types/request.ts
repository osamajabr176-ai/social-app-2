import { JwtPayload } from "jsonwebtoken";
import {Ipic, IUser} from "../interface/interface";

declare module 'express-serve-static-core' {
    interface Request {
        user? : Partial<IUser> & JwtPayload
        pic? : Partial<Ipic>
    }

    }
