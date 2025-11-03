import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (username: string, securityQuestion: string, securityAnswer: string) => {
  const user = await prisma.user.create({
    data: {
      username,
      securityQuestion,
      securityAnswer,
    },
  });
  return user;
};

export const loginUser = async (username: string, securityQuestion: string, securityAnswer: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.securityQuestion !== securityQuestion || user.securityAnswer !== securityAnswer) {
    throw new Error('Invalid security question or answer');
  }

  return user;
};
