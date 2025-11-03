import { Request, Response } from 'express';
import * as authService from './auth.service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};