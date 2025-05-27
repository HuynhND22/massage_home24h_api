import { Request, Response } from 'express';
import * as postService from '../services/post.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, badRequest, noContent } from '../../../utils/response';

/**
 * @desc    Get all posts with pagination
 * @route   GET /api/blog
 * @access  Public
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const { language, page = '1', limit = '10', published } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const publishedOnly = published === 'true';

  const result = await postService.getAllPosts(
    language as string, 
    pageNumber, 
    limitNumber,
    publishedOnly
  );
  
  return success(res, result, 'Posts retrieved successfully');
});

/**
 * @desc    Get post by ID
 * @route   GET /api/blog/:id
 * @access  Public
 */
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { language } = req.query;
  
  if (isNaN(id)) {
    return badRequest(res, 'Invalid post ID');
  }
  
  const post = await postService.getPostById(id, language as string);
  
  if (!post) {
    return notFound(res, 'Post not found');
  }
  
  return success(res, post, 'Post retrieved successfully');
});

/**
 * @desc    Get post by slug
 * @route   GET /api/blog/slug/:slug
 * @access  Public
 */
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { language } = req.query;
  
  const post = await postService.getPostBySlug(slug, language as string);
  
  if (!post) {
    return notFound(res, 'Post not found');
  }
  
  return success(res, post, 'Post retrieved successfully');
});

/**
 * @desc    Create new post
 * @route   POST /api/blog
 * @access  Private/Admin
 */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  // Xử lý dữ liệu đầu vào
  const postData = {
    ...req.body,
    // Chuyển đổi isPublished thành boolean
    isPublished: req.body.isPublished === 'true',
    // Chuyển đổi category thành số nếu có
    categoryId: req.body.category ? parseInt(req.body.category) : null,
    // Chuyển đổi translations thành mảng object nếu là chuỗi
    translations: typeof req.body.translations === 'string' ? 
      JSON.parse(req.body.translations) : req.body.translations
  };

  const post = await postService.createPost(postData);
  return created(res, post, 'Post created successfully');
});

/**
 * @desc    Update post
 * @route   PUT /api/blog/:id
 * @access  Private/Admin
 */
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if post exists
  const existingPost = await postService.getPostById(id);
  
  if (!existingPost) {
    return notFound(res, 'Post not found');
  }
  
  // Xử lý dữ liệu đầu vào
  const postData = {
    ...req.body,
    // Chuyển đổi isPublished thành boolean
    isPublished: req.body.isPublished === 'true',
    // Chuyển đổi category thành số nếu có
    categoryId: req.body.category ? parseInt(req.body.category) : null,
    // Chuyển đổi translations thành mảng object nếu là chuỗi
    translations: typeof req.body.translations === 'string' ? 
      JSON.parse(req.body.translations) : req.body.translations
  };
  
  const post = await postService.updatePost(id, postData);
  return success(res, post, 'Post updated successfully');
});

/**
 * @desc    Delete post
 * @route   DELETE /api/blog/:id
 * @access  Private/Admin
 */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if post exists
  const existingPost = await postService.getPostById(id);
  
  if (!existingPost) {
    return notFound(res, 'Post not found');
  }
  
  await postService.deletePost(id);
  return noContent(res);
});
