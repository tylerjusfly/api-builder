import { Router } from 'express';
import * as roomHandler from './room.handler';

const router = Router();

// Room routes
router.post('/rooms', roomHandler.createRoom);
router.get('/rooms', roomHandler.getRooms);
router.get('/rooms/:id', roomHandler.getRoom);
router.delete('/rooms/:id', roomHandler.deleteRoom);

// Invitation routes
router.post('/rooms/:id/invites', roomHandler.inviteToRoom);
router.put('/invites/:id', roomHandler.updateInvite);

export default router;