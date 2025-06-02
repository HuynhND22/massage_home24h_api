import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Define an extended File interface that includes the location property
interface ExtendedFile extends Express.Multer.File {
  location?: string;
}

// Define an extended Request interface with our custom file property
interface ExtendedRequest extends Request {
  file?: ExtendedFile;
}

// Create a factory function that returns a middleware function for processing file uploads
export const uploadR2 = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // Get environment variables
    const r2AccountId = process.env.R2_ACCOUNT_ID || '';
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
    const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
    const r2BucketName = process.env.R2_BUCKET || 'spa-assets';
    const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://example.com/assets';
    
    // Create disk storage for file upload
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads'); // Make sure this directory exists
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const originalName = file.originalname.split('.').slice(0, -1).join('.');
            const fileExtension = file.originalname.split('.').pop();
            const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
            cb(null, `${sanitizedName}-${timestamp}.${fileExtension}`);
        }
    });
    
    // Create multer instance with disk storage
    const upload = multer({ storage }).single('image');
    
    // Process the upload
    upload(req, res, async (err) => {
        if (err) {
            return next(err);
        }
        
        // If a file was uploaded, modify the file path to use R2 URL format
        if (req.file) {
            // In a real implementation, we would upload to R2 here
            // For now, we just simulate the R2 URL format
            req.file.location = `${r2PublicUrl}/uploads/${req.file.filename}`;
            
            // Add a console log for debugging
            console.log(`File uploaded: ${req.file.originalname}, stored as: ${req.file.filename}`);
            console.log(`File URL: ${req.file.location}`);
        }
        
        next();
    });
};
