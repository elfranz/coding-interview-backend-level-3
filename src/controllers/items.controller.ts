import { Request, ResponseToolkit } from '@hapi/hapi';
import * as service from '../services/items.service'


export async function getAll(request: Request, h: ResponseToolkit) {
    const items = await service.getAllItems()
    return h.response(items).code(200);
}
