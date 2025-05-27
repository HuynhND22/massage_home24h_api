import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { validate } from '../../../utils/validator';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';
import { authenticate, isAdmin } from '../../../middleware/auth';
import { upload } from '../../../middleware/upload';

const router = Router();

// Các routes công khai
router.get('/', serviceController.getAllServices);
router.get('/slug/:slug', serviceController.getServiceBySlug);
router.get('/:id', serviceController.getServiceById);

// Các routes yêu cầu xác thực và quyền admin
router.post('/', authenticate, isAdmin, upload.single('image'), serviceController.createService);
router.put('/:id', authenticate, isAdmin, upload.single('image'), serviceController.updateService);
router.delete('/:id', authenticate, isAdmin, serviceController.deleteService);

export default router;
