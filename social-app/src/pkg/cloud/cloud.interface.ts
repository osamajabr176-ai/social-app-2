//dependecy inversion principle
import multer from "multer";

export interface ICloudProvider {
    uploadFile(file: Express.Multer.File, path: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    getFileUrl(filePath: string): Promise<Buffer>;
    generatePresignedUrl(filePath: Partial<Express.Multer.File>,path: string): Promise<string>;
}