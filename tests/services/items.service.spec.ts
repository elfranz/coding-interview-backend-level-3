import * as service from '../../src/services/items.service';
import prisma from '../../src/database';
import { ItemInput } from '../../src/services/items.service';

jest.mock('../../src/database', () => {
  return {
    __esModule: true,
    default: {
      item: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

describe('Items Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of items', async () => {
      const fakeItems = [{ id: 1, name: 'Test Item', price: 100 }];
      (prisma.item.findMany as jest.Mock).mockResolvedValue(fakeItems);

      const result = await service.getAll();
      expect(result).toEqual(fakeItems);
      expect(prisma.item.findMany).toHaveBeenCalled();
    });

    it('should throw an error if findMany fails', async () => {
      (prisma.item.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.getAll()).rejects.toThrow('Failed to retrieve items');
    });
  });

  describe('get', () => {
    it('should return an item by id', async () => {
      const fakeItem = { id: 1, name: 'Test Item', price: 100 };
      (prisma.item.findUnique as jest.Mock).mockResolvedValue(fakeItem);

      const result = await service.get(1);
      expect(result).toEqual(fakeItem);
      expect(prisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if findUnique fails', async () => {
      (prisma.item.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.get(1)).rejects.toThrow('Failed to retrieve item');
    });
  });

  describe('create', () => {
    it('should create and return an item', async () => {
      const input: ItemInput = { name: 'New Item', price: 200 };
      const fakeItem = { id: 2, ...input };
      (prisma.item.create as jest.Mock).mockResolvedValue(fakeItem);

      const result = await service.create(input);
      expect(result).toEqual(fakeItem);
      expect(prisma.item.create).toHaveBeenCalledWith({ data: input });
    });

    it('should throw an error if create fails', async () => {
      (prisma.item.create as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.create({ name: 'Test', price: 10 })).rejects.toThrow('Failed to create item');
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const updateData = { name: 'Updated Item', price: 300 };
      const fakeItem = { id: 1, ...updateData };
      (prisma.item.update as jest.Mock).mockResolvedValue(fakeItem);

      const result = await service.update(1, updateData);
      expect(result).toEqual(fakeItem);
      expect(prisma.item.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateData });
    });

    it('should throw an error if update fails', async () => {
      (prisma.item.update as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.update(1, { name: 'Test', price: 10 })).rejects.toThrow('Failed to update item');
    });
  });

  describe('deleteItem', () => {
    it('should delete and return an item', async () => {
      const fakeItem = { id: 1, name: 'Deleted Item', price: 100 };
      (prisma.item.delete as jest.Mock).mockResolvedValue(fakeItem);

      const result = await service.deleteItem(1);
      expect(result).toEqual(fakeItem);
      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if delete fails', async () => {
      (prisma.item.delete as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.deleteItem(1)).rejects.toThrow('Failed to delete item');
    });
  });
});