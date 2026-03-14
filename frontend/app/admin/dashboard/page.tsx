import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container-page space-y-3">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Use the main dashboard for metrics and this section for navigation shortcuts.</p>
      <Link href="/admin/puzzles" className="text-emerald-400">Manage puzzles</Link>
    </div>
  );
}
