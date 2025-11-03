import { prisma } from '../../db';

export const createMessage = async (content: string, roomId: string, userId: string) => {
  return await prisma.message.create({
    data: {
      content,
      roomId,
      userId,
    },
  });
};

export const getMessages = async (roomId: string) => {
  return await prisma.message.findMany({
    where: {
      roomId,
    },
    include: {
      user: true,
    },
  });
};