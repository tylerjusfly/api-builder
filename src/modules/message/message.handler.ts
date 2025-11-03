import { Request, Response } from 'express';
import * as messageService from './message.service';

export const createMessage = async (req: Request, res: Response) => {
  const { content, roomId, userId } = req.body;

  if (!content || !roomId || !userId) {
    return res.status(400).json({ message: 'Missing content, roomId, or userId' });
  }

  const message = await messageService.createMessage(content, roomId, userId);

  res.status(201).json(message);
};

export const getMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  const messages = await messageService.getMessages(roomId);

  res.status(200).json(messages);
};