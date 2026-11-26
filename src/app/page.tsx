import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Store, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [zoneCount, stallCount, eventCount, zones] = await Promise.all([
    prisma.marketZone.count(),
    prisma.stall.count(),
    prisma.festiveEvent.count(),
    prisma.marketZone.findMany({
      include: { _count: { select: { stalls: true, events: true } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-rose-950 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-5 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> 27 November – 24 December 2026 • Paisley Town Centre
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
            Experience the Magic of <span className="text-amber-400">Paisley Christmas Markets</span>
          </h1>
          <p className="mt-5 text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
            Inspired by traditional German Weinachtsmärkte and rooted in Renfrewshire’s craft heritage.
            Browse illuminated timber chalets around Paisley Abbey, enjoy spiced Glühwein and Bratwurst,
            or apply online to host your own festive stall.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold shadow-lg transition"
            >
              Explore Markets &amp; Map <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/25 transition"
            >
              Apply as a Trader
            </Link>
          </div>

          {/* 实时数据库统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                <MapPin className="w-4 h-4" /> Market Zones
              </div>
              <p className="text-3xl font-bold mt-1">{zoneCount}</p>
              <p className="text-xs text-emerald-200/80">Historic Paisley landmarks</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                <Store className="w-4 h-4" /> Active Chalets
              </div>
              <p className="text-3xl font-bold mt-1">{stallCount}</p>
              <p className="text-xs text-emerald-200/80">Food, drink &amp; artisan gifts</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                <Calendar className="w-4 h-4" /> Festive Events
              </div>
              <p className="text-3xl font-bold mt-1">{eventCount}</p>
              <p className="text-xs text-emerald-200/80">Music, parades &amp; workshops</p>
            </div>
          </div>
        </div>
      </section>

      {/* 佩斯利 4 大主题集市区 */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">Four Festive Market Zones</h2>
            <p className="text-gray-600 mt-1">
              Designed on a reusable multi-zone pattern so organisers can easily expand across towns and seasons.
            </p>
          </div>
          <Link href="/markets" className="text-rose-800 font-semibold hover:underline inline-flex items-center gap-1">
            View interactive map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-emerald-950">{zone.name}</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                  {zone._count.stalls} Stalls
                </span>
              </div>
              <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {zone.address} • {zone.openDates}
              </p>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{zone.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 商户入驻与平台治理亮点 */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-rose-950 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase">
              <ShieldCheck className="w-4 h-4" /> For Traders &amp; Event Organisers
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              Want to trade at Paisley Christmas Markets 2026?
            </h2>
            <p className="text-rose-100/90 mt-2 text-sm md:text-base">
              Submit your wooden chalet pitch online, track approval status in real time, and manage your
              personal data under UK GDPR standards. Organisers review and publish approved stalls in one click.
            </p>
          </div>
          <Link
            href="/apply"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold transition shadow-lg"
          >
            Start Trader Application
          </Link>
        </div>
      </section>
    </div>
  );
}