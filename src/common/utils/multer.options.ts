import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

export const multerOptionsFactory = (): MulterOptions => {
  const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: process.env.S3_BUCKET_NAME,
      key(_req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = Math.floor(Math.random() * 100000000);
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  };
};
