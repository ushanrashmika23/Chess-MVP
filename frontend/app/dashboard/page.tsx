'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [lichess, setLichess] = useState<any>(null);

  useEffect(() => {
    apiFetch('/users/dashboard').then(setData).catch(() => setData(null));
    apiFetch('/users/profile').then((p) => {
      setProfile(p);
      if (p.lichess_username) {
        apiFetch(`/lichess/${p.lichess_username}`).then(setLichess).catch(() => setLichess(null));
      }
    }).catch(() => setProfile(null));
  }, []);

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user?.role === 'admin' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard label="Students" value={data?.students ?? 0} />
          <StatCard label="Puzzles Created" value={data?.puzzles ?? 0} />
          <StatCard label="Puzzles Solved" value={data?.solvedAttempts ?? 0} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <StatCard label="Solved" value={data?.solved ?? 0} />
            <StatCard label="Accuracy" value={`${data?.accuracy ?? 0}%`} />
          </div>

          {profile?.lichess_username && (
            <div className="rounded bg-slate-900 p-4 text-sm">
              Lichess: {profile.lichess_username} · Rapid rating: {lichess?.perfs?.rapid?.rating ?? 'N/A'}
            </div>
          )}
          <div className="rounded bg-slate-900 p-4">
            <h2 className="mb-2 text-lg">Recent Puzzles</h2>
            <ul className="space-y-1 text-sm">
              {(data?.recent || []).map((item: any) => (
                <li key={item.id}>{item.puzzle.title} - {item.solved ? 'Solved' : 'Unsolved'}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="flex gap-3 text-sm">
        <Link href="/puzzles" className="text-emerald-400">Go to Puzzles</Link>
        {user?.role === 'admin' && <Link href="/admin/puzzles" className="text-emerald-400">Manage Puzzles</Link>}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded bg-slate-900 p-4">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
