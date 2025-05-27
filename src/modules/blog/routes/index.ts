import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { validate } from '../../../utils/validator';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { authenticate, isAdmin } from '../../../middleware/auth';
import { upload } from '../../../middleware/upload';

const router = Router();

// Post Routes
// Các routes công khai cho bài viết
router.get('/', postController.getAllPosts);
router.get('/slug/:slug', postController.getPostBySlug);
router.get('/:id', postController.getPostById);

// Các routes yêu cầu xác thực và quyền admin cho bài viết
router.post('/', authenticate, isAdmin, upload.single('image'), postController.createPost);
router.put('/:id', authenticate, isAdmin, upload.single('image'), postController.updatePost);
router.delete('/:id', authenticate, isAdmin, postController.deletePost);

export default router;
