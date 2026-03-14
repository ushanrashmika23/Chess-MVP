import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';

const attemptSchema = z.object({
  puzzle_id: z.string(),
  solved: z.boolean()
});

export const upsertAttempt = async (req: Request, res: Response) => {
  const parsed = attemptSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const { puzzle_id, solved } = parsed.data;
  const attempt = await prisma.puzzleAttempt.upsert({
    where: {
      userId_puzzleId: {
        userId: req.user!.id,
        puzzleId: puzzle_id
      }
    },
    create: {
      userId: req.user!.id,
      puzzleId: puzzle_id,
      attempts: 1,
      solved,
      solvedAt: solved ? new Date() : null
    },
    update: {
      attempts: { increment: 1 },
      solved,
      solvedAt: solved ? new Date() : null
    }
  });

  return res.status(201).json(attempt);
};

export const getUserAttempts = async (req: Request, res: Response) => {
  const attempts = await prisma.puzzleAttempt.findMany({
    where: { userId: req.user!.id },
    include: { puzzle: true },
    orderBy: { updatedAt: 'desc' }
  });

  return res.json(attempts);
};
