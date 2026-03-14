import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attempts: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const solvedCount = user.attempts.filter((attempt) => attempt.solved).length;
  const totalAttempts = user.attempts.length;

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lichess_username: user.lichessUsername,
    stats: {
      solvedCount,
      accuracy: totalAttempts ? Math.round((solvedCount / totalAttempts) * 100) : 0
    }
  });
};

export const getDashboard = async (req: Request, res: Response) => {
  if (req.user!.role === 'admin') {
    const [students, puzzles, solvedAttempts] = await Promise.all([
      prisma.user.count({ where: { role: 'student' } }),
      prisma.puzzle.count(),
      prisma.puzzleAttempt.count({ where: { solved: true } })
    ]);

    return res.json({
      students,
      puzzles,
      solvedAttempts
    });
  }

  const [attempts, recentAttempts] = await Promise.all([
    prisma.puzzleAttempt.findMany({ where: { userId: req.user!.id } }),
    prisma.puzzleAttempt.findMany({
      where: { userId: req.user!.id },
      include: { puzzle: true },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })
  ]);

  const solved = attempts.filter((attempt) => attempt.solved).length;

  return res.json({
    solved,
    accuracy: attempts.length ? Math.round((solved / attempts.length) * 100) : 0,
    recent: recentAttempts.map((attempt) => ({
      id: attempt.id,
      solved: attempt.solved,
      puzzle: {
        id: attempt.puzzle.id,
        title: attempt.puzzle.title
      }
    }))
  });
};
