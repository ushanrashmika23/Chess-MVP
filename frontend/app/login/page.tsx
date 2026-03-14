import Link from 'next/link';
import { AuthForm } from '../../components/AuthForm';

export default function LoginPage() {
  return (
    <div className="container-page max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <AuthForm mode="login" />
      <p className="text-sm">No account? <Link href="/register" className="text-emerald-400">Register</Link></p>
    </div>
  );
}
