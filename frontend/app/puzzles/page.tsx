'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../services/api';

type Puzzle = {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
};

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  useEffect(() => {
    apiFetch<Puzzle[]>('/puzzles').then(setPuzzles).catch(() => setPuzzles([]));
  }, []);

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-bold">Puzzles</h1>
      <div className="space-y-3">
        {puzzles.map((puzzle) => (
          <Link key={puzzle.id} href={`/puzzles/${puzzle.id}`} className="block rounded bg-slate-900 p-4">
            <h2 className="font-semibold">{puzzle.title}</h2>
            <p className="text-sm text-slate-300">{puzzle.difficulty} · {puzzle.tags.join(', ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
