import {Request, Response, NextFunction} from "express";
import userService from "../../modules/user/user.service";
import "../types/request";
import {Ipic} from "../interface/interface";

export async function uploadPic(req: Request, res: Response, next: NextFunction) {

   try {
       const {fileName,contentType} = req.body;
       const userId = req.user?.id;
       if (fileName && contentType){
       const presignedUrl = await userService.uploadProfilePicturePresignedUrl(userId as string, { originalname: fileName, mimetype: contentType } as Express.Multer.File);
       req.pic = presignedUrl as Partial<Ipic> ;
       next();}
       else {
           next();
       }
   } catch (err) {
       next(err)
   }

}

