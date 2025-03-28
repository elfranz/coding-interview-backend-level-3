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