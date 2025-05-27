import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { validate } from '../../../utils/validator';
import { createContactSchema } from '../validators/contact.validator';
import { authenticate, isAdmin } from '../../../middleware/auth';

const router = Router();

// Public route for sending contact message
router.post('/', validate(createContactSchema), contactController.createContact);

// Admin routes requiring authentication
router.get('/', authenticate, isAdmin, contactController.getAllContacts);
router.get('/:id', authenticate, isAdmin, contactController.getContactById);
router.patch('/:id/read', authenticate, isAdmin, contactController.markAsRead);
router.delete('/:id', authenticate, isAdmin, contactController.deleteContact);

export default router;
