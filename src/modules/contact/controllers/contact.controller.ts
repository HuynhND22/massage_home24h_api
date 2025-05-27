import { Request, Response } from 'express';
import * as contactService from '../services/contact.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { success, created, notFound, badRequest, noContent } from '../../../utils/response';

/**
 * @desc    Get all contact messages with pagination
 * @route   GET /api/contact
 * @access  Private/Admin
 */
export const getAllContacts = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '10', isRead } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  
  let isReadFilter: boolean | undefined = undefined;
  if (isRead === 'true') isReadFilter = true;
  if (isRead === 'false') isReadFilter = false;

  const result = await contactService.getAllContacts(
    pageNumber, 
    limitNumber,
    isReadFilter
  );
  
  return success(res, result, 'Contact messages retrieved successfully');
});

/**
 * @desc    Get contact message by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  const contact = await contactService.getContactById(id);
  
  if (!contact) {
    return notFound(res, 'Contact message not found');
  }
  
  return success(res, contact, 'Contact message retrieved successfully');
});

/**
 * @desc    Create new contact message (from public form)
 * @route   POST /api/contact
 * @access  Public
 */
export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await contactService.createContact(req.body);
  return created(res, contact, 'Your message has been sent successfully');
});

/**
 * @desc    Mark contact message as read
 * @route   PATCH /api/contact/:id/read
 * @access  Private/Admin
 */
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if contact message exists
  const existingContact = await contactService.getContactById(id);
  
  if (!existingContact) {
    return notFound(res, 'Contact message not found');
  }
  
  const contact = await contactService.markAsRead(id);
  return success(res, contact, 'Contact message marked as read');
});

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  // Check if contact message exists
  const existingContact = await contactService.getContactById(id);
  
  if (!existingContact) {
    return notFound(res, 'Contact message not found');
  }
  
  await contactService.deleteContact(id);
  return noContent(res);
});
