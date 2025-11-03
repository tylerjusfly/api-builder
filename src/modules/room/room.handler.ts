import { Request, Response } from 'express';
import * as roomService from './room.service';

export const createRoom = async (req: Request, res: Response) => {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
        return res.status(400).json({ message: 'Missing name or ownerId' });
    }

    const room = await roomService.createRoom(name, ownerId);

    res.status(201).json(room);
};
export const getRooms = async (req: Request, res: Response) => {
    const rooms = await roomService.getRooms();

    res.status(200).json(rooms);
};
export const getRoom = async (req: Request, res: Response) => {
    const { id } = req.params;

    const room = await roomService.getRoom(id);

    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
};
export const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.params;

    await roomService.deleteRoom(id);

    res.status(204).send();
};
export const inviteToRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Missing username' });
    }

    try {
        const invitation = await roomService.inviteToRoom(id, username);

        res.status(201).json(invitation);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};
export const updateInvite = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Missing or invalid status' });
    }

    const invitation = await roomService.updateInvite(id, status);

    res.status(200).json(invitation);
};