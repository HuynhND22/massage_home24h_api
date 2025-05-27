import { Request, Response } from 'express';
import * as serviceService from '../services/service.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, badRequest, noContent } from '../../../utils/response';

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public
 */
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const { language } = req.query;
  const services = await serviceService.getAllServices(language as string);
  return success(res, services, 'Services retrieved successfully');
});

/**
 * @desc    Get service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { language } = req.query;
  
  if (isNaN(id)) {
    return badRequest(res, 'Invalid service ID');
  }
  
  const service = await serviceService.getServiceById(id, language as string);
  
  if (!service) {
    return notFound(res, 'Service not found');
  }
  
  return success(res, service, 'Service retrieved successfully');
});

/**
 * @desc    Get service by slug
 * @route   GET /api/services/slug/:slug
 * @access  Public
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { language } = req.query;
  
  const service = await serviceService.getServiceBySlug(slug, language as string);
  
  if (!service) {
    return notFound(res, 'Service not found');
  }
  
  return success(res, service, 'Service retrieved successfully');
});

/**
 * @desc    Create new service
 * @route   POST /api/services
 * @access  Private/Admin
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.body);
  return created(res, service, 'Service created successfully');
});

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private/Admin
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if service exists
  const existingService = await serviceService.getServiceById(id);
  
  if (!existingService) {
    return notFound(res, 'Service not found');
  }
  
  const service = await serviceService.updateService(id, req.body);
  return success(res, service, 'Service updated successfully');
});

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private/Admin
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if service exists
  const existingService = await serviceService.getServiceById(id);
  
  if (!existingService) {
    return notFound(res, 'Service not found');
  }
  
  await serviceService.deleteService(id);
  return noContent(res);
});
