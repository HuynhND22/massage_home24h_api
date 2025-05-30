import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UsersService } from './modules/users/users.service';
import { UserRole } from './modules/users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3001;
  const apiPrefix = configService.get<string>('apiPrefix') || 'api';

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS for all domains
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Set up validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Spa & Massage API')
    .setDescription('API documentation for Spa & Massage multilingual website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Check if any users exist and create default admin if needed
  const logger = new Logger('Bootstrap');
  const usersService = app.get(UsersService);
  
  try {
    const users = await usersService.findAll();
    
    if (users.length === 0) {
      logger.log('No users found in database. Creating default admin user...');
      
      // Create default admin user
      const adminUser = await usersService.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
        isActive: true
      });
      
      logger.log(`Default admin user created with email: ${adminUser.email}`);
      logger.log('Please change the password after first login!');
    }
  } catch (error) {
    logger.error('Failed to create default admin user', error.message);
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
