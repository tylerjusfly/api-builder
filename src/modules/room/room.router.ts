import { Router } from 'express';
import * as roomHandlers from './room.handlers';

// The Prisma client should be imported and used within handlers if needed.
const router = Router();

router.post('/', roomHandlers.createRoom);

export default router;
