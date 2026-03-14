import { Router } from 'express';
import {
  createPuzzle,
  deletePuzzle,
  getPuzzleById,
  listPuzzles,
  updatePuzzle
} from '../controllers/puzzle.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', listPuzzles);
router.get('/:id', getPuzzleById);
router.post('/', requireRole('admin'), createPuzzle);
router.put('/:id', requireRole('admin'), updatePuzzle);
router.delete('/:id', requireRole('admin'), deletePuzzle);

export default router;
