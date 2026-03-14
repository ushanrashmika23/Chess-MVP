import { Router } from 'express';
import { getUserAttempts, upsertAttempt } from '../controllers/attempt.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.post('/', upsertAttempt);
router.get('/user', getUserAttempts);

export default router;
