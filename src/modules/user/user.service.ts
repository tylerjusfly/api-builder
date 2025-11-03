import { prisma } from '../../db';
import bcrypt from 'bcrypt';

export const createUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};