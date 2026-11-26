'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2, Plus, ShieldCheck } from 'lucide-react';

interface AdminData {
  zones: { id: string; name: string }[];
  stalls: { id: string; name: string; category: string; chaletNumber: string; priceRange: string; zone: { name: string } }[];
  applications: {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    category: string;
    chaletSize: string;
    description: string;
    status: string;
    zone: { name: string };
  }[];
  events: { id: string; title: string; category: string; eventDate: string; zone: { name: string } }[];
  stats: {
    totalZones: number;
    totalStalls: number;
    pendingApplications: number;
    totalEvents: number;
    registeredUsers: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<'applications' | 'stalls' | 'events'>('applications');
  const [newStall, setNewStall] = useState({
    name: '',
    category: 'German Specialities',
    description: '',
    chaletNumber: '',
    priceRange: '££',
    zoneId: '',
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '2026-12-15T18:00',
    category: 'Live Music',
    zoneId: '',
  });

  const loadOverview = useCallback(async () => {
    const res = await fetch('/api/admin/overview');
    if (res.status === 403 || res.status === 401) {
      router.push('/auth/signin');
      return;
    }
    const json = await res.json();
    setData(json);
    if (json.zones?.length > 0) {
      setNewStall((prev) => ({ ...prev, zoneId: prev.zoneId || json.zones[0].id }));
      setNewEvent((prev) => ({ ...prev, zoneId: prev.zoneId || json.zones[0].id }));
    }
  }, [router]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  async function updateApplication(id: string, status: 'approved' | 'rejected', publishAsStall = false) {
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        publishAsStall,
        adminNotes:
          status === 'approved'
            ? publishAsStall
              ? 'Approved and published to live market directory.'
              : 'Approved by Paisley WinterFest organiser.'
            : 'Pitch not selected for this seasonal cycle.',
      }),
    });
    loadOverview();
  }

  async function deleteApplication(id: string) {
    if (!confirm('Delete this application record?')) return;
    await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
    loadOverview();
  }

  async function handleCreateStall(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/stalls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStall),
    });
    if (res.ok) {
      setNewStall((prev) => ({ ...prev, name: '', description: '', chaletNumber: '' }));
      loadOverview();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add stall');
    }
  }

  async function deleteStall(id: string) {
    if (!confirm('Remove this chalet stall from the live market directory?')) return;
    await fetch(`/api/admin/stalls/${id}`, { method: 'DELETE' });
    loadOverview();
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      setNewEvent((prev) => ({ ...prev, title: '', description: '' }));
      loadOverview();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add event');
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this festive event?')) return;
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    loadOverview();
  }

  if (!data) return <p className="text-center py-16 text-gray-500">Verifying administrator session...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-rose-800">
            <ShieldCheck className="w-4 h-4" /> Role-Based Access Control (Admin)
          </span>
          <h1 className="text-3xl font-bold text-emerald-950">Paisley Market Organiser Console</h1>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Pending Apps', val: data.stats.pendingApplications },
          { label: 'Live Stalls', val: data.stats.totalStalls },
          { label: 'Market Zones', val: data.stats.totalZones },
          { label: 'Festive Events', val: data.stats.totalEvents },
          { label: 'Accounts', val: data.stats.registeredUsers },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            <p className="text-2xl font-extrabold text-emerald-950 mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      {/* 导航标签页 */}
      <div className="flex gap-2 border-b border-stone-200 pb-3">
        {(
          [
            ['applications', `Trader Applications (${data.applications.length})`],
            ['stalls', `Manage Stalls (${data.stalls.length})`],
            ['events', `Manage Events (${data.events.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
              tab === key ? 'bg-emerald-900 text-amber-300' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: 商户申请审核 */}
      {tab === 'applications' && (
        <div className="space-y-4">
          {data.applications.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg text-emerald-950">{app.businessName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
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
                <p className="text-xs text-gray-600 mt-1">
                  Contact: {app.contactName} ({app.email}) • {app.zone.name} • {app.category} • {app.chaletSize}
                </p>
                <p className="text-sm text-gray-700 mt-2">{app.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {app.status !== 'approved' && (
                  <button
                    onClick={() => updateApplication(app.id, 'approved', true)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve &amp; Publish Stall
                  </button>
                )}
                {app.status !== 'rejected' && (
                  <button
                    onClick={() => updateApplication(app.id, 'rejected', false)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                  title="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: 摊位 CRUD */}
      {tab === 'stalls' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateStall} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add New Market Chalet Stall
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                placeholder="Stall Name"
                value={newStall.name}
                onChange={(e) => setNewStall({ ...newStall, name: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
              <input
                required
                placeholder="Chalet No. (e.g., A-12)"
                value={newStall.chaletNumber}
                onChange={(e) => setNewStall({ ...newStall, chaletNumber: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
              <select
                value={newStall.zoneId}
                onChange={(e) => setNewStall({ ...newStall, zoneId: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              >
                {data.zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={newStall.category}
                onChange={(e) => setNewStall({ ...newStall, category: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              >
                <option>German Specialities</option>
                <option>Food &amp; Drink</option>
                <option>Artisan Crafts</option>
                <option>Gifts &amp; Decor</option>
              </select>
              <select
                value={newStall.priceRange}
                onChange={(e) => setNewStall({ ...newStall, priceRange: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              >
                <option value="£">£ (Budget)</option>
                <option value="££">££ (Standard)</option>
                <option value="£££">£££ (Artisan Premium)</option>
              </select>
            </div>
            <textarea
              required
              placeholder="Stall description (min 10 characters)"
              value={newStall.description}
              onChange={(e) => setNewStall({ ...newStall, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
            />
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 text-sm font-bold cursor-pointer">
              Add Stall
            </button>
          </form>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-3.5">Chalet</th>
                  <th className="p-3.5">Stall Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Zone</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.stalls.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3.5 font-mono font-bold">{s.chaletNumber}</td>
                    <td className="p-3.5 font-semibold text-emerald-950">{s.name}</td>
                    <td className="p-3.5">{s.category}</td>
                    <td className="p-3.5 text-gray-600">{s.zone.name}</td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => deleteStall(s.id)} className="text-rose-700 hover:text-rose-900 cursor-pointer">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: 活动排期 CRUD */}
      {tab === 'events' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateEvent} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Schedule New Festive Event
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
              <input
                type="datetime-local"
                required
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
              <select
                value={newEvent.zoneId}
                onChange={(e) => setNewEvent({ ...newEvent, zoneId: e.target.value })}
                className="px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
              >
                {data.zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <textarea
              required
              placeholder="Event description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
            />
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 text-sm font-bold cursor-pointer">
              Add Event
            </button>
          </form>

          <div className="space-y-3">
            {data.events.map((ev) => (
              <div key={ev.id} className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-950">{ev.title}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(ev.eventDate).toLocaleString('en-GB')} • {ev.zone.name} • {ev.category}
                  </p>
                </div>
                <button onClick={() => deleteEvent(ev.id)} className="text-rose-700 hover:text-rose-900 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}