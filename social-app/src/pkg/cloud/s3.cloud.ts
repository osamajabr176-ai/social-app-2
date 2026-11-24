
import { ICloudProvider } from "./cloud.interface";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { toSeconds } from "../utils/time";
interface S3Config {
        
        s3Region: string
        accessKey: string
        secretAccessKey: string
        bucketName?: string
    }

export class S3CloudProvider implements ICloudProvider {

    private client: S3Client;
    private readonly bucketName: string;
    constructor(config: S3Config) {
        
        this.client = new S3Client({
            region: config.s3Region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.bucketName = config.bucketName || "";
    }

    public async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key:`social-app/${path}/${new Date().toISOString()}-${file.originalname}`,
        });
        await this.client.send(command);

        return command.input.Key as string;
    }
    public async deleteFile(fileUrl: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileUrl,
        });
        await this.client.send(command);
    }
    public async getFileUrl(filePath: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: filePath,
        });
        const response = await this.client.send(command);
        return response.Body as unknown as Buffer;
    }
    public async generatePresignedUrl(filePath: Partial<Express.Multer.File>, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `social-app/${path}/${new Date().toISOString()}-${filePath.originalname}`,
            ContentType: filePath.mimetype,
        });
        return await getSignedUrl(this.client, command, { expiresIn: toSeconds(3,"minutes") }); 
    }

}
