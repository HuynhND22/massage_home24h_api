import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { badRequest } from './response';

/**
 * Validates request data against a Joi schema
 * @param schema Joi validation schema
 * @param property Request property to validate (body, query, params)
 */
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (!error) {
      next();
    } else {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));

      return badRequest(res, 'Validation error', errorDetails);
    }
  };
};
