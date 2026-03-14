'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../services/api';

type AuthFormProps = {
  mode: 'login' | 'register';
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(form.get('email')),
      password: String(form.get('password'))
    };

    if (mode === 'register') {
      payload.name = String(form.get('name'));
      payload.lichess_username = String(form.get('lichess_username') || '');
    }

    try {
      const data = await apiFetch<{ token: string; user: { id: string; name: string; role: 'admin' | 'student' } }>(
        mode === 'login' ? '/auth/login' : '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-slate-900 p-6">
      {mode === 'register' && (
        <input required name="name" placeholder="Name" className="w-full rounded border border-slate-700 bg-slate-800 p-2" />
      )}
      <input required type="email" name="email" placeholder="Email" className="w-full rounded border border-slate-700 bg-slate-800 p-2" />
      <input required type="password" name="password" placeholder="Password" className="w-full rounded border border-slate-700 bg-slate-800 p-2" />
      {mode === 'register' && (
        <input name="lichess_username" placeholder="Lichess username" className="w-full rounded border border-slate-700 bg-slate-800 p-2" />
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button disabled={loading} className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold">
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}
