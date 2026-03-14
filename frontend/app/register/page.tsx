import Link from 'next/link';
import { AuthForm } from '../../components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="container-page max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Register</h1>
      <AuthForm mode="register" />
      <p className="text-sm">Already have an account? <Link href="/login" className="text-emerald-400">Login</Link></p>
    </div>
  );
}
