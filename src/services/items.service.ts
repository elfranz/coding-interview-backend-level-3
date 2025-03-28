import { Item } from '@prisma/client';
import prisma from '../database';
import * as Boom from '@hapi/boom';

export interface ItemInput {
    name: string;
    price: number;
}

export async function getAll(): Promise<Item[]> {
    try {
        return await prisma.item.findMany()
    } catch (error) {
        console.error(error);
        throw Boom.internal('Failed to retrieve items', error);
    }
}

export async function get(id: number): Promise<Item> {
    try {
        const item = await prisma.item.findUnique({ where: { id } });
        if (!item) {
            throw Boom.notFound('Item not found');
        }
        return item;
    } catch (error) {
        console.error(error);
        if (Boom.isBoom(error)) throw error;
        throw Boom.internal('Failed to retrieve item', error);
    }
}

export async function create(data: ItemInput): Promise<Item> {
    try {
        return await prisma.item.create({data})
    } catch (error) {
        console.error(error);
        throw Boom.internal('Failed to create item', error);
    }
}

// im not adding this as a transaction since the update is being performed in one operation
export async function update(id: number, data: Partial<ItemInput>): Promise<Item>{
    try {
        return await prisma.item.update({where: {id: Number(id)}, data: data})
    } catch (error) {
        console.error(error);
        throw Boom.internal('Failed to update item', error);
    }
}

export async function deleteItem(id: number): Promise<Item | null>{
    try {
        return await prisma.item.delete({where: {id: Number(id)}})
    } catch (error) {
        console.error(error);
        throw Boom.internal('Failed to delete item', error);
    }
}