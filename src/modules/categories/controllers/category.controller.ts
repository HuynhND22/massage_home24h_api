import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, badRequest, noContent } from '../../../utils/response';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return success(res, categories, 'Categories retrieved successfully');
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return badRequest(res, 'Invalid category ID');
  }
  
  const category = await categoryService.getCategoryById(id);
  
  if (!category) {
    return notFound(res, 'Category not found');
  }
  
  return success(res, category, 'Category retrieved successfully');
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  return created(res, category, 'Category created successfully');
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return badRequest(res, 'Invalid category ID');
  }
  
  // Check if category exists
  const existingCategory = await categoryService.getCategoryById(id);
  
  if (!existingCategory) {
    return notFound(res, 'Category not found');
  }
  
  const category = await categoryService.updateCategory(id, req.body);
  return success(res, category, 'Category updated successfully');
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return badRequest(res, 'Invalid category ID');
  }
  
  // Check if category exists
  const existingCategory = await categoryService.getCategoryById(id);
  
  if (!existingCategory) {
    return notFound(res, 'Category not found');
  }
  
  await categoryService.deleteCategory(id);
  return noContent(res);
});
