const mockPrismaClient = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const PrismaClient = jest.fn(() => mockPrismaClient);

export { PrismaClient };
export const prismaMock = mockPrismaClient;
