import { Router } from 'express';
import { getLichessProfile } from '../controllers/lichess.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:username', authMiddleware, getLichessProfile);

export default router;
