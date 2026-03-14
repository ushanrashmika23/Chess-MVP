'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../../services/api';
import { PuzzleBoard } from '../../../components/PuzzleBoard';

type Puzzle = {
  id: string;
  title: string;
  description: string;
  fenPosition: string;
  solutionMoves: string[];
};

export default function PuzzleDetailPage() {
  const params = useParams<{ id: string }>();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    apiFetch<Puzzle>(`/puzzles/${params.id}`).then(setPuzzle).catch(() => setPuzzle(null));
  }, [params.id]);

  if (!puzzle) {
    return <div className="container-page">Loading puzzle...</div>;
  }

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-bold">{puzzle.title}</h1>
      <p className="text-slate-300">{puzzle.description}</p>
      <PuzzleBoard puzzle={puzzle} />
    </div>
  );
}
