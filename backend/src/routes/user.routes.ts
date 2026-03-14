import { Router } from 'express';
import { getDashboard, getProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/dashboard', authMiddleware, getDashboard);

export default router;
