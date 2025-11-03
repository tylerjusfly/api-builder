import { prisma } from '../../db';

export const createRoom = async (name: string, ownerId: string) => {
  return await prisma.room.create({
    data: {
      name,
      ownerId,
    },
  });
};
export const getRooms = async () => {
  return await prisma.room.findMany();
};
export const getRoom = async (id: string) => {
  return await prisma.room.findUnique({
    where: {
      id,
    },
  });
};
export const deleteRoom = async (id: string) => {
  return await prisma.room.delete({
    where: {
      id,
    },
  });
};
export const inviteToRoom = async (roomId: string, username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.invitation.create({
    data: {
      roomId,
      userId: user.id,
    },
  });
};
export const updateInvite = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
  return await prisma.invitation.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};