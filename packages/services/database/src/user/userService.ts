import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const createUser = async (
  email: string,
  name: string,
  password: string,
  role: "ADMIN" | "USER" = "USER"
) => {
  try {
    return await prisma.user.create({
      data: { email, name, password, role },
    });
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id: number) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: number,
  data: Partial<{ email: string; name: string }>
) => {
  try {
    return prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    return prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};
