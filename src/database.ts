import { PrismaClient } from "@prisma/client";

type Item = {
  id: number
  name: string
  price: number
}

type ItemInput = {
    name: string;
    price: number;
  };  

// Mock database implementation
let testItems: Item[] = [];
let nextId = 1;

const mockPrisma = {
  item: {
    findMany: async () => testItems,
    findUnique: async ({ where }: { where: { id: number } }) => 
      testItems.find(item => item.id === where.id),
    create: async ({ data }: { data: ItemInput }) => {
      const newItem = { id: nextId++, ...data };
      testItems.push(newItem);
      return newItem;
    },
    update: async ({ where, data }: { where: { id: number }, data: Partial<Item> }) => {
      const index = testItems.findIndex(item => item.id === where.id);
      if (index === -1) throw new Error('Not found');
      testItems[index] = { ...testItems[index], ...data };
      return testItems[index];
    },
    delete: async ({ where }: { where: { id: number } }) => {
      const index = testItems.findIndex(item => item.id === where.id);
      if (index === -1) throw new Error('Not found');
      return testItems.splice(index, 1)[0];
    },
    deleteMany: async () => {
      const count = testItems.length;
      testItems = [];
      nextId = 1;
      return { count };
    }
  },
  $disconnect: async () => {}
};

// Choose implementation based on environment
const prisma = process.env.NODE_ENV === 'test' 
  ? mockPrisma 
  : new PrismaClient();

export default prisma;