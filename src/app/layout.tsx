import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Paisley Christmas Markets | Paisley WinterFest 2026',
  description:
    'Official proof-of-concept portal for Paisley Christmas Markets — explore German-themed chalets, festive events, interactive maps, and online trader applications.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-emerald-950 text-emerald-200/80 border-t border-amber-500/20 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>
              <p className="font-semibold text-amber-300">Paisley WinterFest — Paisley Christmas Markets Portal</p>
              <p className="text-xs mt-1 text-emerald-300/70">
                Fictional client proof-of-concept built for COMP10020 Internet Technologies (UWS 2026–27).
              </p>
            </div>
            <div className="text-xs text-emerald-300/70">
              UK GDPR Compliant Design • Multi-Market White-Label Ready
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}