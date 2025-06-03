import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = new Date().toISOString();
    
    // Log request details
    console.log(`\n=== REQUEST [${now}] ===`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log('Params:', JSON.stringify(req.params, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Log when the request is done
    return next.handle().pipe(
        tap(() => {
            console.log(`\n=== RESPONSE [${new Date().toISOString()}] ===`);
            console.log(`Status: ${context.switchToHttp().getResponse().statusCode}`);
        })
    );
  }
}
