'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    consentGiven: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/account');
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Create Trader Account</h1>
        <p className="text-sm text-gray-600 mt-1">Track your chalet applications and manage GDPR preferences.</p>

        {error && <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-sm border border-rose-200">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Business Name (Optional)</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password (min 6 chars) *</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>
          <label className="flex items-start gap-2.5 text-xs text-gray-700 bg-stone-50 p-3 rounded-xl border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consentGiven}
              onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })}
              className="mt-0.5 accent-emerald-800"
            />
            <span>
              I consent to the collection and storage of my account data in accordance with UK GDPR for Paisley
              Christmas Markets portal services.
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-sm cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          Already registered?{' '}
          <Link href="/auth/signin" className="text-emerald-800 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}