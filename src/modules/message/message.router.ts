import { Router } from 'express';
import * as messageHandler from './message.handler';

const router = Router();

router.post('/messages', messageHandler.createMessage);
router.get('/messages/:roomId', messageHandler.getMessages);

export default router;