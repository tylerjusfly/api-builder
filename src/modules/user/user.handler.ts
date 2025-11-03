import { Request, Response } from 'express';
import * as userService from './user.service';

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing username, email, or password' });
  }

  const user = await userService.createUser(username, email, password);

  res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();

  res.status(200).json(users);
};