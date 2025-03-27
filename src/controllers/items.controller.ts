import { Request, ResponseToolkit } from '@hapi/hapi';
import * as service from '../services/items.service'
import { itemPayloadSchema, itemUpdatePayloadSchema } from '../validators/items.validators';

export async function getAll(request: Request, h: ResponseToolkit) {
    const items = await service.getAll()
    return h.response(items).code(200);
}

export async function get(request: Request, h: ResponseToolkit) {
    const id = request.params.id
    const item = await service.get(id)
    if (!item) {
        return h.response().code(404);
    }
    return h.response(item).code(200)
}

export async function create(request: Request, h: ResponseToolkit) {
    const { error, value } = itemPayloadSchema.validate(request.payload, { abortEarly: false });
    // checks if error is present, and builds response
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context?.key,
            message: detail.message
        }))
        return h.response({ errors }).code(400);
    }
    const item = await service.create(value);
    return h.response(item).code(201);
}

export async function update(request: Request, h: ResponseToolkit) {
    const id = Number(request.params.id)

    const { error, value } = itemUpdatePayloadSchema.validate(request.payload, { abortEarly: false });
    // checks if error is present, and builds response
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context?.key || 'unknown',
            message: detail.message
        }))
        return h.response({ errors }).code(400);
    }
    const item = await service.update(id, value)
    return h.response(item).code(200)
}

//delete is a reserved word
export async function deleteItem(request: Request, h: ResponseToolkit) {
    const id = request.params.id
    const item = await service.deleteItem(id)
    if (!item) {
        return h.response().code(404);
    }
    return h.response(item).code(204)
}