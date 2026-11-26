'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Snowflake, ShieldCheck, User, LogOut } from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'trader' | 'admin';
}

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? 'bg-amber-400/20 text-amber-200'
        : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 text-white border-b border-amber-500/30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Snowflake className="w-6 h-6 text-amber-400" />
          <span>
            Paisley <span className="text-amber-400">WinterFest</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={navLinkClass('/')}>Home</Link>
          <Link href="/markets" className={navLinkClass('/markets')}>Explore Markets &amp; Map</Link>
          <Link href="/apply" className={navLinkClass('/apply')}>Trader Application</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className={navLinkClass('/admin')}>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Panel
              </span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-sm text-amber-100 border border-emerald-700"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[110px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-sm text-white cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-800"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-emerald-950"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}