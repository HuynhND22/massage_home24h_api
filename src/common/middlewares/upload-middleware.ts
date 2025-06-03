import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';

interface ExtendedFile extends Express.Multer.File {
  location?: string;
}
interface ExtendedRequest extends Request {
  file?: ExtendedFile;
}

export const uploadR2 = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const r2Endpoint = process.env.R2_ENDPOINT;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2BucketName = process.env.R2_BUCKET || 'spa-assets';
  const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://example.com/assets';

  // Ensure uploads directory exists
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: r2AccessKeyId || '',
      secretAccessKey: r2SecretAccessKey || '',
    },
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      const fileExtension = file.originalname.split('.').pop();
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      cb(null, `${sanitizedName}-${timestamp}.${fileExtension}`);
    },
  });

  // Không cho multer tự động parse json hoặc urlencoded
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    preservePath: true
  }).single('image');

  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return next(err);
    }

    // Log body để debug
    console.log('Form data received:', req.body);

    if (!req.file) {
      console.log('No file uploaded');
      return next(); // No file uploaded
    }

    console.log('File uploaded:', req.file.originalname);
    const filePath = path.join(uploadDir, req.file.filename);

    try {
      const fileContent = fs.readFileSync(filePath);

      const command = new PutObjectCommand({
        Bucket: r2BucketName,
        Key: `uploads/${req.file.filename}`,
        Body: fileContent,
        ContentType: req.file.mimetype,
      });

      await s3.send(command);

      // Gán đúng location từ R2 public URL
      req.file.location = `${r2PublicUrl}/uploads/${req.file.filename}`;
      console.log('File uploaded to R2:', req.file.location);

      // Xoá file tạm sau khi upload
      fs.unlinkSync(filePath);

      next();
    } catch (uploadErr) {
      console.error('Upload to R2 failed:', uploadErr);
      return next(uploadErr);
    }
  });
};
