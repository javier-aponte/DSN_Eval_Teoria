import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId ?? '',
    secretAccessKey: process.env.secretAccessKey ?? ''
  }
});

export const uploadFile = async (fileBuffer: any, fileOriginalName: string, mimeType: string) => {
  const params: PutObjectCommand = new PutObjectCommand({
    Bucket: process.env.bucket ?? '',
    Key: `images/${fileOriginalName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ContentDisposition: 'inline'
  });

  try {
    const response = await s3.send(params);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};

export const deleteFile = async (imgS3Key: string) => {
  const params: DeleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.bucket,
    Key: imgS3Key
  });

  try {
    const response = await s3.send(params);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};