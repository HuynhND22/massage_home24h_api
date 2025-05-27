import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../../../utils/validator';
import { registerSchema, loginSchema, updateUserSchema, changePasswordSchema } from '../validators/user.validator';
import { authenticate, isAdmin } from '../../../middleware/auth';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), userController.login);

// Private routes
router.get('/me', authenticate, userController.getCurrentUser);
router.put('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

// Admin routes
router.post('/register', authenticate, isAdmin, validate(registerSchema), userController.register);
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.put('/:id', authenticate, isAdmin, validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

export default router;
