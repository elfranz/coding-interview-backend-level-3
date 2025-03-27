import { Item } from '@prisma/client';
import prisma from '../database';

export interface ItemInput {
    name: string;
    price: number;
}

export async function getAll(): Promise<Item[]> {
    try {
        return await prisma.item.findMany()
    } catch (error) {
        console.log(error)
        throw new Error('Failed to retrieve items');
    }
}

export async function get(id: number): Promise<Item | null> {
    try {
        return await prisma.item.findUnique({where: {id: Number(id)}})
    } catch (error) {
        console.log(error)
        throw new Error('Failed to retrieve item');
    }
}

export async function create(data: ItemInput): Promise<Item> {
    try {
        return await prisma.item.create({data})
    } catch (error) {
        console.log(error)
        throw new Error('Failed to create item');
    }
}

// im not adding this as a transaction since the update is being performed in one operation
export async function update(id: number, data: Partial<ItemInput>): Promise<Item>{
    try {
        return await prisma.item.update({where: {id: Number(id)}, data: data})
    } catch (error) {
        console.log(error)
        throw new Error('Failed to update item');
    }
}

export async function deleteItem(id: number): Promise<Item | null>{
    try {
        return await prisma.item.delete({where: {id: Number(id)}})
    } catch (error) {
        console.log(error)
        throw new Error('Failed to delete item');
    }
}