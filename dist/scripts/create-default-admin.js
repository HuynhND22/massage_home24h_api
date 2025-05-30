"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../modules/users/users.service");
const user_entity_1 = require("../modules/users/entities/user.entity");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('CreateDefaultAdmin');
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const usersService = app.get(users_service_1.UsersService);
        const users = await usersService.findAll();
        if (users.length === 0) {
            logger.log('No users found in database. Creating default admin user...');
            const adminUser = await usersService.create({
                name: 'Admin',
                email: 'admin@home24h.com',
                password: 'Admin@123',
                role: user_entity_1.UserRole.ADMIN,
                isActive: true
            });
            logger.log(`Default admin user created with email: ${adminUser.email}`);
            logger.log('Please change the password after first login!');
        }
        else {
            logger.log('Users already exist in database. Skipping default admin creation.');
        }
        await app.close();
    }
    catch (error) {
        logger.error('Failed to create default admin user', error);
    }
}
bootstrap();
//# sourceMappingURL=create-default-admin.js.map