import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../modules/users/entities/user.entity';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CreateDefaultAdmin');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    
    // Check if any users exist
    const users = await usersService.findAll();
    
    if (users.length === 0) {
      logger.log('No users found in database. Creating default admin user...');
      
      // Create default admin user
      const adminUser = await usersService.create({
        name: 'Admin',
        email: 'admin@home24h.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
        isActive: true
      });
      
      logger.log(`Default admin user created with email: ${adminUser.email}`);
      logger.log('Please change the password after first login!');
    } else {
      logger.log('Users already exist in database. Skipping default admin creation.');
    }
    
    await app.close();
  } catch (error) {
    logger.error('Failed to create default admin user', error);
  }
}

bootstrap();
