import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRoom = async (ownerId: string, maxUsers = 5) => {
  const room = await prisma.room.create({
    data: {
      ownerId,
      maxUsers,
    },
  });
  return room;
};
