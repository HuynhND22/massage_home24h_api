import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ServicesModule } from './modules/services/services.module';
import { SlidesModule } from './modules/slides/slides.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { WebSettingsModule } from './modules/web-settings/web-settings.module';
import { UploadModule } from './modules/upload/upload.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BlogsModule,
    ServicesModule,
    SlidesModule,
    ContactsModule,
    FeedbacksModule,
    WebSettingsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Áp dụng middleware cho tất cả các routes
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
