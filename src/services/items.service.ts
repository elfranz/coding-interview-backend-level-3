import prisma from '../database';

export async function getAllItems() {
    return prisma.item.findMany()
}