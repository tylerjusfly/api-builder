import { Router } from 'express';
import * as authHandler from './auth.handler';

const router = Router();

router.post('/login', authHandler.login);

export default router;