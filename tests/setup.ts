import prisma from '../src/database';

beforeEach(async () => {
    // Fast cleanup between tests
    await prisma.item.deleteMany();
});
  
afterAll(async () => {
    await prisma.$disconnect();
});