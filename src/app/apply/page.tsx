'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Store } from 'lucide-react';

interface ZoneOption {
  id: string;
  name: string;
}

export default function TraderApplyPage() {
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: 'German Specialities',
    chaletSize: 'Standard 3x2m (£450)',
    zoneId: '',
    description: '',
    hygieneCertRef: '',
    gdprConsent: false,
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; refId?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/markets')
      .then((r) => r.json())
      .then((d) => {
        const list = d.zones || [];
        setZones(list);
        if (list.length > 0) setForm((prev) => ({ ...prev, zoneId: list[0].id }));
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Submission failed. Please check all fields.' });
      } else {
        setStatus({
          type: 'success',
          message: 'Your trader application has been submitted and is now awaiting organiser review!',
          refId: data.application.id,
        });
        setForm((prev) => ({
          ...prev,
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          description: '',
          hygieneCertRef: '',
          gdprConsent: false,
        }));
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-rose-800">
          <Store className="w-4 h-4" /> 2026 Festive Season Pitch Application
        </span>
        <h1 className="text-3xl font-bold text-emerald-950 mt-1">Apply to Trade at Paisley Christmas Markets</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Complete the form below to request a wooden chalet pitch. Tip: Sign in before applying to track your live
          approval status inside your Account dashboard.
        </p>
      </div>

      {status && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
            status.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-700" />
          )}
          <div className="text-sm">
            <p className="font-semibold">{status.message}</p>
            {status.refId && <p className="text-xs mt-1 font-mono">Application Reference ID: {status.refId}</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Business / Stall Name *</label>
            <input
              required
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              placeholder="e.g., Alpine Cinnamon Bakery"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Primary Contact Name *</label>
            <input
              required
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="e.g., Hannah Stewart"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Business Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="trader@example.co.uk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Telephone Number *</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+44 7700 900123"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Stall Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
            >
              <option value="German Specialities">German Specialities</option>
              <option value="Food & Drink">Food &amp; Drink</option>
              <option value="Artisan Crafts">Artisan Crafts</option>
              <option value="Gifts & Decor">Gifts &amp; Decor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Chalet Package *</label>
            <select
              value={form.chaletSize}
              onChange={(e) => setForm({ ...form, chaletSize: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
            >
              <option value="Standard 3x2m (£450)">Standard 3x2m (£450)</option>
              <option value="Double 6x2m (£820)">Double 6x2m (£820)</option>
              <option value="Food Chalet with Power (£980)">Food Chalet with Power (£980)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Preferred Zone *</label>
            <select
              value={form.zoneId}
              onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Food Hygiene / Public Liability Ref (Optional for Non-Food)
          </label>
          <input
            type="text"
            value={form.hygieneCertRef}
            onChange={(e) => setForm({ ...form, hygieneCertRef: e.target.value })}
            placeholder="e.g., REN-FH-2026-1042"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Product &amp; Stall Description *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your festive goods, German or Scottish heritage themes, and electrical requirements..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
          <input
            type="checkbox"
            checked={form.gdprConsent}
            onChange={(e) => setForm({ ...form, gdprConsent: e.target.checked })}
            className="mt-1 w-4 h-4 accent-emerald-800"
          />
          <span className="text-xs text-gray-700 leading-relaxed">
            <strong>UK GDPR Explicit Consent:</strong> I agree that Paisley WinterFest Events Ltd may store and process
            my contact and business details strictly to assess my market pitch application. I understand I can export or
            request deletion of my personal data at any time via the Account portal.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-sm transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? 'Submitting Application...' : 'Submit Trader Application'}
        </button>
      </form>
    </div>
  );
}