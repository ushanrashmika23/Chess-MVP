import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container-page space-y-4">
      <h1 className="text-3xl font-bold">Chess Academy Training Platform</h1>
      <p>Train academy students with curated tactical puzzles.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-emerald-600 px-4 py-2">Login</Link>
        <Link href="/register" className="rounded border border-slate-700 px-4 py-2">Register</Link>
      </div>
    </div>
  );
}
