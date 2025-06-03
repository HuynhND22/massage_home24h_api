import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log request trước khi xử lý
    console.log('\n===== REQUEST LOGGER MIDDLEWARE =====');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', req.body);
    console.log('Files:', req.files || req.file || 'Không có files');
    console.log('====================================\n');

    // Log response sau khi xử lý
    const originalSend = res.send;
    res.send = function (body) {
      console.log('\n===== RESPONSE LOGGER MIDDLEWARE =====');
      console.log(`[${new Date().toISOString()}] Status: ${res.statusCode}`);
      console.log('====================================\n');
      return originalSend.call(this, body);
    };

    next();
  }
}
