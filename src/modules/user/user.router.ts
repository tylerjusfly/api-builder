import { Router } from 'express';
import * as userHandler from './user.handler';

const router = Router();

router.post('/users', userHandler.createUser);
router.get('/users', userHandler.getUsers);

export default router;