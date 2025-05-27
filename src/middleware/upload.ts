import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/env';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../', config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// Create upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize // Default: 5MB
  },
  fileFilter: fileFilter
});

// Helper function to generate file URL
export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};
