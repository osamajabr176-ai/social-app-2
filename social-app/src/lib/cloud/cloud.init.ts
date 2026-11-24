import { S3CloudProvider } from "../../pkg/cloud/s3.cloud";
import { env } from "../config/env";


// singleton pattern

export const s3CloudProvider = new S3CloudProvider({
    s3Region: env.s3.s3Region,
    accessKey: env.s3.accessKey,
    secretAccessKey: env.s3.secretAccessKey,
    bucketName: env.s3.bucketName,
});