import { NextFunction , Request , Response} from "express";
import { AppError } from "./error.js";

export function globalerror (err :AppError , req :Request , res :Response , next :NextFunction)  {

    if(err.isOperational)
    {
        return res.status(err.statusCode).json({
            message : err.message ,
            success: false
        })
    }
    return res.status(500).json({
        error :'something went wrong' , succes : false
    })
}