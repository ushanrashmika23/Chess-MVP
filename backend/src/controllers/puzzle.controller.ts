import { Request, Response } from 'express';
import { Difficulty } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../prisma';

const puzzleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  fen_position: z.string().min(8),
  solution_moves: z.array(z.string()).min(1),
  difficulty: z.nativeEnum(Difficulty),
  tags: z.array(z.string()).default([]),
  visibility: z.boolean().default(true),
  assigned_student_ids: z.array(z.string()).optional()
});

export const listPuzzles = async (req: Request, res: Response) => {
  const where =
    req.user?.role === 'admin'
      ? {}
      : {
          OR: [
            { visibility: true },
            {
              assignments: {
                some: {
                  studentId: req.user?.id
                }
              }
            }
          ]
        };

  const puzzles = await prisma.puzzle.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return res.json(puzzles);
};

export const getPuzzleById = async (req: Request, res: Response) => {
  const puzzle = await prisma.puzzle.findUnique({
    where: { id: req.params.id },
    include: { assignments: true }
  });

  if (!puzzle) {
    return res.status(404).json({ message: 'Puzzle not found' });
  }

  if (
    req.user?.role !== 'admin' &&
    !puzzle.visibility &&
    !puzzle.assignments.some((assignment) => assignment.studentId === req.user?.id)
  ) {
    return res.status(403).json({ message: 'Puzzle is private' });
  }

  return res.json(puzzle);
};

export const createPuzzle = async (req: Request, res: Response) => {
  const parsed = puzzleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const data = parsed.data;
  const puzzle = await prisma.puzzle.create({
    data: {
      title: data.title,
      description: data.description,
      fenPosition: data.fen_position,
      solutionMoves: data.solution_moves,
      difficulty: data.difficulty,
      tags: data.tags,
      visibility: data.visibility,
      createdById: req.user!.id,
      assignments: data.assigned_student_ids
        ? {
            createMany: {
              data: data.assigned_student_ids.map((studentId) => ({ studentId }))
            }
          }
        : undefined
    }
  });

  return res.status(201).json(puzzle);
};

export const updatePuzzle = async (req: Request, res: Response) => {
  const parsed = puzzleSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const data = parsed.data;
  const puzzle = await prisma.puzzle.update({
    where: { id: req.params.id },
    data: {
      title: data.title,
      description: data.description,
      fenPosition: data.fen_position,
      solutionMoves: data.solution_moves,
      difficulty: data.difficulty,
      tags: data.tags,
      visibility: data.visibility
    }
  });

  if (data.assigned_student_ids) {
    await prisma.puzzleAssignment.deleteMany({ where: { puzzleId: req.params.id } });
    await prisma.puzzleAssignment.createMany({
      data: data.assigned_student_ids.map((studentId) => ({
        puzzleId: req.params.id,
        studentId
      })),
      skipDuplicates: true
    });
  }

  return res.json(puzzle);
};

export const deletePuzzle = async (req: Request, res: Response) => {
  await prisma.puzzle.delete({ where: { id: req.params.id } });
  return res.status(204).send();
};
