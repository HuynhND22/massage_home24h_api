import { Response } from 'express';

/**
 * Standard success response
 */
export const success = (res: Response, data: any = null, message: string = 'Success', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standard error response
 */
export const error = (res: Response, message: string = 'Error occurred', statusCode: number = 500, errors: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Not found response
 */
export const notFound = (res: Response, message: string = 'Resource not found') => {
  return error(res, message, 404);
};

/**
 * Bad request response
 */
export const badRequest = (res: Response, message: string = 'Bad request', errors: any = null) => {
  return error(res, message, 400, errors);
};

/**
 * Unauthorized response
 */
export const unauthorized = (res: Response, message: string = 'Unauthorized') => {
  return error(res, message, 401);
};

/**
 * Forbidden response
 */
export const forbidden = (res: Response, message: string = 'Forbidden') => {
  return error(res, message, 403);
};

/**
 * Created response
 */
export const created = (res: Response, data: any = null, message: string = 'Resource created successfully') => {
  return success(res, data, message, 201);
};

/**
 * No content response
 */
export const noContent = (res: Response) => {
  return res.status(204).end();
};
