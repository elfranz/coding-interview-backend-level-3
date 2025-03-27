import Joi from 'joi';
import { Request, ResponseToolkit } from '@hapi/hapi';

export const itemPayloadSchema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'any.required': 'Field "name" is required',
        'string.base': 'Field "name" must be a string'
      }),
    price: Joi.number()
      .min(0)
      .required()
      .messages({
        'any.required': 'Field "price" is required',
        'number.base': 'Field "price" must be a number',
        'number.min': 'Field "price" cannot be negative'
      })
}).options({ abortEarly: false });

export const itemUpdatePayloadSchema = Joi.object({
    // id: Joi.number()
    //     .required(),
    name: Joi.string()
        .messages({
        'string.base': 'Field "name" must be a string'
        }),
    price: Joi.number()
        .min(0)
        .messages({
        'number.base': 'Field "price" must be a number',
        'number.min': 'Field "price" cannot be negative'
        })
}).or('name', 'price').messages({
        'object.missing': 'Must provide at least one field to update'
}).options({ abortEarly: false });

export function handleValidationError(request: Request, h: ResponseToolkit, err: any) {
    if (err?.isJoi && Array.isArray(err.details)) {
        const errors = err.details.map((detail: Joi.ValidationErrorItem) => ({
            field: detail.context?.key || 'unknown',
            message: detail.message
        }));

        return h.response({ errors }).code(400).takeover();
    }

    return h.response({ 
        errors: [{ field: 'unknown', message: 'An unexpected error occurred' }]
    }).code(500).takeover();
}