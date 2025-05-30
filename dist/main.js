"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./modules/users/users.service");
const user_entity_1 = require("./modules/users/entities/user.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port') || 3001;
    const apiPrefix = configService.get('apiPrefix') || 'api';
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Spa & Massage API')
        .setDescription('API documentation for Spa & Massage multilingual website')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    const logger = new common_1.Logger('Bootstrap');
    const usersService = app.get(users_service_1.UsersService);
    try {
        const users = await usersService.findAll();
        if (users.length === 0) {
            logger.log('No users found in database. Creating default admin user...');
            const adminUser = await usersService.create({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'Admin@123',
                role: user_entity_1.UserRole.ADMIN,
                isActive: true
            });
            logger.log(`Default admin user created with email: ${adminUser.email}`);
            logger.log('Please change the password after first login!');
        }
    }
    catch (error) {
        logger.error('Failed to create default admin user', error.message);
    }
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
    console.log(`Swagger documentation is available at: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map