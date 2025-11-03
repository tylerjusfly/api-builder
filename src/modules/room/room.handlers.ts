import { Request, Response } from 'express';
import * as roomService from './room.service';

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { ownerId, maxUsers } = req.body;
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }
    const room = await roomService.createRoom(ownerId, maxUsers);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};
