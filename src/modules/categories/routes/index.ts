import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, isAdmin } from '../../../middleware/auth';

const router = Router();

// Routes công khai
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Routes yêu cầu xác thực và quyền admin
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

export default router;
