import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, noContent } from '../../../utils/response';

/**
 * @desc    Get all settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getAllSettings = asyncHandler(async (req: Request, res: Response) => {
  const { language } = req.query;
  const settings = await settingsService.getAllSettings(language as string);
  return success(res, settings, 'Settings retrieved successfully');
});

/**
 * @desc    Get setting by key
 * @route   GET /api/settings/:key
 * @access  Public
 */
export const getSettingByKey = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const { language } = req.query;
  
  const setting = await settingsService.getSettingByKey(key, language as string);
  
  if (!setting) {
    return notFound(res, 'Setting not found');
  }
  
  return success(res, setting, 'Setting retrieved successfully');
});

/**
 * @desc    Create or update setting
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
export const upsertSetting = asyncHandler(async (req: Request, res: Response) => {
  const setting = await settingsService.upsertSetting(req.body);
  return success(res, setting, 'Setting updated successfully');
});

/**
 * @desc    Delete setting
 * @route   DELETE /api/settings/:key
 * @access  Private/Admin
 */
export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  
  // Check if setting exists
  const existingSetting = await settingsService.getSettingByKey(key);
  
  if (!existingSetting) {
    return notFound(res, 'Setting not found');
  }
  
  await settingsService.deleteSetting(key);
  return noContent(res);
});
