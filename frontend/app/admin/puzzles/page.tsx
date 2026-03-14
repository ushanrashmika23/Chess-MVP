'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';

type Puzzle = {
  id: string;
  title: string;
  visibility: boolean;
};

export default function AdminPuzzlesPage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  const load = () => apiFetch<Puzzle[]>('/puzzles').then(setPuzzles).catch(() => setPuzzles([]));
  useEffect(() => {
    load();
  }, []);

  const createPuzzle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    await apiFetch('/puzzles', {
      method: 'POST',
      body: JSON.stringify({
        title: form.get('title'),
        description: form.get('description'),
        fen_position: form.get('fen_position'),
        solution_moves: String(form.get('solution_moves')).split(',').map((m) => m.trim()),
        difficulty: form.get('difficulty'),
        tags: String(form.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean),
        visibility: form.get('visibility') === 'on'
      })
    });

    event.currentTarget.reset();
    load();
  };

  const removePuzzle = async (id: string) => {
    await apiFetch(`/puzzles/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-bold">Puzzle Management</h1>
      <form onSubmit={createPuzzle} className="grid gap-2 rounded bg-slate-900 p-4">
        <input required name="title" placeholder="Title" className="rounded border border-slate-700 bg-slate-800 p-2" />
        <textarea required name="description" placeholder="Description" className="rounded border border-slate-700 bg-slate-800 p-2" />
        <input required name="fen_position" placeholder="FEN position" className="rounded border border-slate-700 bg-slate-800 p-2" />
        <input required name="solution_moves" placeholder="solution moves ex: d1d8,g8g7,d8g8" className="rounded border border-slate-700 bg-slate-800 p-2" />
        <input name="tags" placeholder="tags ex: fork,mate" className="rounded border border-slate-700 bg-slate-800 p-2" />
        <select name="difficulty" className="rounded border border-slate-700 bg-slate-800 p-2">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <label className="text-sm"><input type="checkbox" name="visibility" defaultChecked className="mr-2" />Visible to all students</label>
        <button className="rounded bg-emerald-600 px-4 py-2">Create puzzle</button>
      </form>

      <div className="space-y-2">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="flex items-center justify-between rounded bg-slate-900 p-3">
            <span>{puzzle.title} ({puzzle.visibility ? 'Public' : 'Private'})</span>
            <button onClick={() => removePuzzle(puzzle.id)} className="rounded bg-rose-700 px-3 py-1 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
