'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Trash2, Shield } from 'lucide-react';

interface AccountData {
  id: string;
  name: string;
  email: string;
  role: string;
  businessName?: string;
  consentGiven: boolean;
  consentAt?: string;
  applications: {
    id: string;
    businessName: string;
    category: string;
    chaletSize: string;
    status: string;
    adminNotes?: string;
    createdAt: string;
    zone: { name: string };
  }[];
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push('/auth/signin');
        else setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDeleteAccount() {
    if (!confirm('Are you sure? Under UK GDPR Right to Erasure, this permanently deletes your account and data.')) {
      return;
    }
    const res = await fetch('/api/me', { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || 'Could not delete account');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  if (loading || !user) return <p className="text-center py-16 text-gray-500">Loading your account...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">{user.name}</h1>
          <p className="text-sm text-gray-600">{user.email} • Role: <strong className="uppercase">{user.role}</strong></p>
          {user.businessName && <p className="text-sm text-emerald-800 mt-1">Business: {user.businessName}</p>}
          <p className="text-xs text-gray-500 mt-2">
            GDPR Consent Recorded: {user.consentGiven ? 'Yes' : 'No'}{' '}
            {user.consentAt ? `(${new Date(user.consentAt).toLocaleString('en-GB')})` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <a
            href="/api/me/export"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold"
          >
            <Download className="w-4 h-4" /> Download My Data (JSON)
          </a>
          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-bold cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Account (GDPR)
          </button>
        </div>
      </div>

      {msg && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-sm text-amber-900">{msg}</div>}

      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-emerald-950">My Trader Applications</h2>
          <Link href="/apply" className="text-xs font-bold text-emerald-800 hover:underline">+ New Application</Link>
        </div>
        {user.applications.length === 0 ? (
          <p className="text-sm text-gray-500">You have not submitted any market pitch applications yet.</p>
        ) : (
          <div className="space-y-3">
            {user.applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between gap-2">
                <div>
                  <p className="font-bold text-emerald-950">{app.businessName}</p>
                  <p className="text-xs text-gray-600">{app.zone.name} • {app.category} • {app.chaletSize}</p>
                  {app.adminNotes && <p className="text-xs text-amber-800 mt-1">Organiser note: {app.adminNotes}</p>}
                </div>
                <span
                  className={`h-fit w-fit px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    app.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950 flex gap-3">
        <Shield className="w-5 h-5 text-emerald-700 shrink-0" />
        <div>
          <p className="font-bold">UK GDPR Data Subject Rights Active</p>
          <p className="mt-1 text-emerald-900/80">
            This portal implements Art. 6/7 (Explicit Consent), Art. 15/20 (Self-Service JSON Data Export), Art. 17
            (Right to Erasure), and Art. 32 (bcrypt password hashing + HttpOnly JWT sessions).
          </p>
        </div>
      </div>
    </div>
  );
}