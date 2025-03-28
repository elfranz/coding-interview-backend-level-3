import { Request, ResponseToolkit } from '@hapi/hapi';
import * as service from '../services/items.service'
import { itemPayloadSchema, itemUpdatePayloadSchema } from '../validators/items.validators';
import * as Boom from '@hapi/boom'

export async function getAll(request: Request, h: ResponseToolkit) {
    const items = await service.getAll()
    return h.response(items).code(200);
}

export async function get(request: Request, h: ResponseToolkit) {
    try {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            throw Boom.badRequest('Invalid id');
        }
        const item = await service.get(id);
        return h.response(item).code(200);
    } catch (error) {
        if (Boom.isBoom(error)) {
            throw error;
        }
        throw Boom.badRequest('Failed to retrieve item', { originalError: error });
    }
}

export async function create(request: Request, h: ResponseToolkit) {
    const { error, value } = itemPayloadSchema.validate(request.payload, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.context?.key,
      message: detail.message
    }));
    // Throw Boom with custom data; this data will be picked up by the global error handler
    throw Boom.badRequest('Validation error', { errors });
  }
  const item = await service.create(value);
  return h.response(item).code(201);
}

export async function update(request: Request, h: ResponseToolkit) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
        throw Boom.badRequest('Invalid id', { errors: [{ field: 'id', message: 'Invalid id' }] });
    }
    const { error, value } = itemUpdatePayloadSchema.validate(request.payload, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
        field: detail.context?.key || 'unknown',
        message: detail.message
        }));
        throw Boom.badRequest('Validation error', { errors });
    }
    const item = await service.update(id, value);
    return h.response(item).code(200);
}

//delete is a reserved word
export async function deleteItem(request: Request, h: ResponseToolkit) {
    try {
        const id = request.params.id;
        const item = await service.deleteItem(id);
        if (!item) {
            return h.response().code(404);
        }
        return h.response(item).code(204);
    } catch (error) {
        if (Boom.isBoom(error)) {
            throw error;
        }
        throw Boom.badRequest('Failed to delete item', { originalError: error });
    }
}