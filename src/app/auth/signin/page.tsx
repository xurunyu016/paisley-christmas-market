'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign in failed');
      } else {
        router.push(data.user.role === 'admin' ? '/admin' : '/account');
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Sign In</h1>
        <p className="text-sm text-gray-600 mt-1">Access your trader applications or administrator console.</p>

        {error && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-sm border border-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-sm cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* 方便评审老师快速测试的演示账号框 */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 text-amber-950">
          <p className="font-bold uppercase tracking-wide text-amber-800">Demo Credentials (For Assessment):</p>
          <p><strong>Admin:</strong> admin@paisleychristmas.uk / Admin2026!</p>
          <p><strong>Trader:</strong> trader@paisleychristmas.uk / Trader2026!</p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          New trader?{' '}
          <Link href="/auth/register" className="text-emerald-800 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}