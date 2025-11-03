import { Router } from 'express';
import * as userHandlers from './user.handlers';

const router = Router();

router.post('/register', userHandlers.registerUser);
router.post('/login', userHandlers.loginUser);

export default router;
