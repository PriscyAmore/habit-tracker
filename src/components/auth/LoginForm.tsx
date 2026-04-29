'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logIn } from '@/lib/auth';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = logIn(email, password);
    if (result.success) {
      router.replace('/dashboard');
    } else {
      setError(result.error ?? 'Login failed');
    }
  }

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Log In</h2>
      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm text-gray-300 mb-1">
            Email
          </label>
          <input
            id="login-email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm text-gray-300 mb-1">
            Password
          </label>
          <input
            id="login-password"
            data-testid="auth-login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          data-testid="auth-login-submit"
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-gray-400 text-sm text-center">
        No account?{' '}
        <Link href="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
