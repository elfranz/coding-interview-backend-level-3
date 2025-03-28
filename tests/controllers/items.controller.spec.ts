import { Request } from '@hapi/hapi';
import * as controller from '../../src/controllers/items.controller';
import * as service from '../../src/services/items.service';
import * as Boom from '@hapi/boom';
// import { ValidationErrorItem } from 'joi';

jest.mock('../../src/services/items.service', () => ({
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteItem: jest.fn(),
}));

const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
} as any;

describe('Items Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all items with 200 status', async () => {
            const fakeItems = [{ id: 1, name: 'Test Item', price: 100 }];
            (service.getAll as jest.Mock).mockResolvedValue(fakeItems);

            const response = await controller.getAll({} as Request, mockH);
            
            expect(service.getAll).toHaveBeenCalled();
            expect(mockH.response).toHaveBeenCalledWith(fakeItems);
            expect(mockH.code).toHaveBeenCalledWith(200);
        });

        it('should throw error when service fails', async () => {
            (service.getAll as jest.Mock).mockRejectedValue(new Error('Service error'));
            
            await expect(controller.getAll({} as Request, mockH))
                .rejects.toThrow(Boom.boomify(new Error('Service error')));
        });
    });

    describe('get', () => {
        it('should return item with 200 status for valid ID', async () => {
            const fakeItem = { id: 1, name: 'Test Item', price: 100 };
            (service.get as jest.Mock).mockResolvedValue(fakeItem);
            const mockRequest = { params: { id: '1' } } as unknown as Request;

            const response = await controller.get(mockRequest, mockH);
            
            expect(service.get).toHaveBeenCalledWith(1);
            expect(mockH.response).toHaveBeenCalledWith(fakeItem);
            expect(mockH.code).toHaveBeenCalledWith(200);
        });

        it('should throw bad request for invalid ID', async () => {
            const mockRequest = { params: { id: 'invalid' } } as unknown as Request;

            await expect(controller.get(mockRequest, mockH))
                .rejects.toThrow(Boom.badRequest('Invalid id'));
            });

            it('should throw error when service fails', async () => {
            (service.get as jest.Mock).mockRejectedValue(new Error('Service error'));
            const mockRequest = { params: { id: '1' } } as unknown as Request;

            await expect(controller.get(mockRequest, mockH))
                .rejects.toThrow(Boom.badRequest('Failed to retrieve item'));
        });
    });

    describe('create', () => {
        const validPayload = { name: 'New Item', price: 200 };

        it('should create item with 201 status for valid payload', async () => {
            const fakeItem = { id: 2, ...validPayload };
            (service.create as jest.Mock).mockResolvedValue(fakeItem);
            const mockRequest = { payload: validPayload } as Request;

            const response = await controller.create(mockRequest, mockH);
            
            expect(service.create).toHaveBeenCalledWith(validPayload);
            expect(mockH.response).toHaveBeenCalledWith(fakeItem);
            expect(mockH.code).toHaveBeenCalledWith(201);
        });

        //TODO: figure this out
        // it('should throw validation error with details for invalid payload', async () => {
        //     const invalidPayload = { name: '', price: -10 };
        //     const mockRequest = { payload: invalidPayload } as Request;
        
        //     await expect(controller.create(mockRequest, mockH))
        //         .rejects.toMatchObject({
        //             isBoom: true,
        //             output: {
        //                 statusCode: 400,
        //                 payload: {
        //                     message: 'Validation error',
        //                     // Boom puts custom data in the 'data' property
        //                     data: {
        //                         errors: expect.arrayContaining([
        //                             expect.objectContaining({ field: 'name' }),
        //                             expect.objectContaining({ field: 'price' })
        //                         ])
        //                     }
        //                 }
        //             }
        //         });
        // });
    });

    describe('update', () => {
        const validPayload = { name: 'Updated Item', price: 300 };

        it('should update item with 200 status for valid request', async () => {
            const fakeItem = { id: 1, ...validPayload };
            (service.update as jest.Mock).mockResolvedValue(fakeItem);
            const mockRequest = { 
                params: { id: '1' },
                payload: validPayload
            } as unknown as Request;

            const response = await controller.update(mockRequest, mockH);
            
            expect(service.update).toHaveBeenCalledWith(1, validPayload);
            expect(mockH.response).toHaveBeenCalledWith(fakeItem);
            expect(mockH.code).toHaveBeenCalledWith(200);
        });

        it('should throw bad request for invalid ID', async () => {
        const mockRequest = { 
            params: { id: 'invalid' },
            payload: validPayload
        } as unknown as Request;

        await expect(controller.update(mockRequest, mockH))
            .rejects.toThrow(Boom.badRequest('Invalid id'));
        });
    });

    describe('deleteItem', () => {
        it('should delete item and return 204 status', async () => {
            const fakeItem = { id: '1', name: 'Deleted Item', price: 100 };
            (service.deleteItem as jest.Mock).mockResolvedValue(fakeItem);
            const mockRequest = { params: { id: '1' } } as unknown as Request;

            const response = await controller.deleteItem(mockRequest, mockH);
            
            expect(service.deleteItem).toHaveBeenCalledWith('1');
            expect(mockH.response).toHaveBeenCalledWith(fakeItem);
            expect(mockH.code).toHaveBeenCalledWith(204);
        });

        it('should return 404 if item not found', async () => {
            (service.deleteItem as jest.Mock).mockResolvedValue(null);
            const mockRequest = { params: { id: '1' } } as unknown as Request;

            const response = await controller.deleteItem(mockRequest, mockH);
            
            expect(mockH.response).toHaveBeenCalled();
            expect(mockH.code).toHaveBeenCalledWith(404);
        });

        it('should throw error when service fails', async () => {
            (service.deleteItem as jest.Mock).mockRejectedValue(new Error('Service error'));
            const mockRequest = { params: { id: '1' } } as unknown as Request;

            await expect(controller.deleteItem(mockRequest, mockH))
                .rejects.toThrow(Boom.badRequest('Failed to delete item'));
        });
    });
});