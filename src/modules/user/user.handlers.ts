import { Request, Response } from 'express';
import * as userService from './user.service';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, securityQuestion, securityAnswer } = req.body;
    if (!username || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Username, security question, and answer are required' });
    }
    const user = await userService.createUser(username, securityQuestion, securityAnswer);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, securityQuestion, securityAnswer } = req.body;
    if (!username || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Username, security question, and answer are required' });
    }
    const user = await userService.loginUser(username, securityQuestion, securityAnswer);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};
