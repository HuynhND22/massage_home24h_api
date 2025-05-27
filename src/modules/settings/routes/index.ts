import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';
import { validate } from '../../../utils/validator';
import { settingsSchema } from '../validators/settings.validator';
import { authenticate, isAdmin } from '../../../middleware/auth';

const router = Router();

// Public routes
router.get('/', settingsController.getAllSettings);
router.get('/:key', settingsController.getSettingByKey);

// Admin routes
router.put('/', authenticate, isAdmin, validate(settingsSchema), settingsController.upsertSetting);
router.delete('/:key', authenticate, isAdmin, settingsController.deleteSetting);

export default router;
