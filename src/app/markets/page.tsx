'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Calendar, Store } from 'lucide-react';

const MarketMap = dynamic(() => import('@/components/MarketMap'), { ssr: false });

interface Stall {
  id: string;
  name: string;
  category: string;
  description: string;
  chaletNumber: string;
  priceRange: string;
}

interface FestiveEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  category: string;
}

interface MarketZone {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  openDates: string;
  stalls: Stall[];
  events: FestiveEvent[];
}

const CATEGORIES = ['All', 'German Specialities', 'Food & Drink', 'Artisan Crafts', 'Gifts & Decor'];

export default function MarketsPage() {
  const [zones, setZones] = useState<MarketZone[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'All') params.set('category', category);

    fetch(`/api/markets?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setZones(data.zones || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query, category]);

  const mapPoints = zones.map((z) => ({
    id: z.id,
    name: z.name,
    address: z.address,
    lat: z.lat,
    lng: z.lng,
    stallCount: z.stalls.length,
  }));

  const visibleZones = selectedZoneId ? zones.filter((z) => z.id === selectedZoneId) : zones;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-950">Explore Paisley Christmas Markets</h1>
        <p className="text-gray-600 mt-1">
          Search wooden chalets, filter by category, and click any marker on the Paisley town map to filter by zone.
        </p>
      </div>

      {/* 搜索栏与分类筛选 */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Bratwurst, Glühwein, tartan, crafts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                category === cat
                  ? 'bg-emerald-900 text-amber-300'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 交互式地图 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-700" /> Interactive Paisley Market Map (OpenStreetMap / Leaflet)
          </h2>
          {selectedZoneId && (
            <button
              onClick={() => setSelectedZoneId(null)}
              className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Clear zone filter (Show all zones)
            </button>
          )}
        </div>
        <MarketMap zones={mapPoints} selectedZoneId={selectedZoneId} onSelectZone={setSelectedZoneId} />
      </div>

      {/* 摊位与活动列表 */}
      {loading ? (
        <p className="text-center py-12 text-gray-500">Loading festive market stalls...</p>
      ) : (
        <div className="space-y-10">
          {visibleZones.map((zone) => (
            <section key={zone.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
              <div className="border-b border-stone-100 pb-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-950">{zone.name}</h2>
                  <p className="text-xs text-amber-700 font-medium mt-1">
                    {zone.address} • {zone.openDates}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 w-fit">
                  {zone.stalls.length} Chalet(s) Shown
                </span>
              </div>

              {zone.stalls.length === 0 ? (
                <p className="text-sm text-gray-500 italic mb-6">No stalls match the current filter in this zone.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {zone.stalls.map((stall) => (
                    <div key={stall.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-900 text-amber-200">
                          Chalet {stall.chaletNumber}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800">{stall.priceRange}</span>
                      </div>
                      <h3 className="font-bold text-emerald-950 mt-2 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-amber-600 shrink-0" /> {stall.name}
                      </h3>
                      <p className="text-xs text-rose-800 font-medium mt-0.5">{stall.category}</p>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">{stall.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {zone.events.length > 0 && (
                <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/70">
                  <h3 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5" /> Upcoming Festive Schedule in this Zone
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {zone.events.map((ev) => (
                      <div key={ev.id} className="text-xs bg-white p-3 rounded-lg border border-amber-200/60">
                        <div className="font-bold text-emerald-950">{ev.title}</div>
                        <div className="text-amber-700 font-medium mt-0.5">
                          {new Date(ev.eventDate).toLocaleString('en-GB', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}{' '}
                          • {ev.category}
                        </div>
                        <p className="text-gray-600 mt-1">{ev.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}