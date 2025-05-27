import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, badRequest, unauthorized, forbidden, noContent } from '../../../utils/response';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Private/Admin
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    return created(res, user, 'User registered successfully');
  } catch (error: any) {
    return badRequest(res, error.message);
  }
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (error: any) {
    return unauthorized(res, error.message);
  }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return unauthorized(res, 'Not authenticated');
  }
  
  const user = await userService.getUserById(userId);
  
  if (!user) {
    return notFound(res, 'User not found');
  }
  
  return success(res, user, 'User profile retrieved successfully');
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return success(res, users, 'Users retrieved successfully');
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  const user = await userService.getUserById(id);
  
  if (!user) {
    return notFound(res, 'User not found');
  }
  
  return success(res, user, 'User retrieved successfully');
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if user exists
  const existingUser = await userService.getUserById(id);
  
  if (!existingUser) {
    return notFound(res, 'User not found');
  }
  
  // Prevent changing own role (if admin)
  if (req.user?.id === id && req.body.role && req.body.role !== existingUser.role) {
    return forbidden(res, 'You cannot change your own role');
  }
  
  try {
    const user = await userService.updateUser(id, req.body);
    return success(res, user, 'User updated successfully');
  } catch (error: any) {
    return badRequest(res, error.message);
  }
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return unauthorized(res, 'Not authenticated');
  }
  
  const { currentPassword, newPassword } = req.body;
  
  try {
    await userService.changePassword(userId, currentPassword, newPassword);
    return success(res, null, 'Password changed successfully');
  } catch (error: any) {
    return badRequest(res, error.message);
  }
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if user exists
  const existingUser = await userService.getUserById(id);
  
  if (!existingUser) {
    return notFound(res, 'User not found');
  }
  
  // Prevent deleting yourself
  if (req.user?.id === id) {
    return forbidden(res, 'You cannot delete your own account');
  }
  
  await userService.deleteUser(id);
  return noContent(res);
});
