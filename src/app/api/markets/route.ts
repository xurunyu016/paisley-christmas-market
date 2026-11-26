import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface StallItem {
  id: string;
  name: string;
  category: string;
  description: string;
  chaletNumber: string;
  priceRange: string;
}

interface ZoneItem {
  id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  openDates: string;
  stalls: StallItem[];
  events: unknown[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim().toLowerCase() || '';
    const category = searchParams.get('category') || 'All';

    const zones = await prisma.marketZone.findMany({
      include: {
        stalls: { orderBy: { chaletNumber: 'asc' } },
        events: { orderBy: { eventDate: 'asc' } },
      },
      orderBy: { name: 'asc' },
    });

    const filteredZones = zones.map((zone: ZoneItem) => {
      const filteredStalls = zone.stalls.filter((stall: StallItem) => {
        const matchesCat = category === 'All' || stall.category === category;
        const matchesQ =
          !q ||
          stall.name.toLowerCase().includes(q) ||
          stall.description.toLowerCase().includes(q) ||
          stall.category.toLowerCase().includes(q) ||
          zone.name.toLowerCase().includes(q);
        return matchesCat && matchesQ;
      });
      return { ...zone, stalls: filteredStalls };
    });

    return NextResponse.json({ zones: filteredZones });
  } catch (error) {
    console.error('Markets GET error:', error);
    return NextResponse.json({ error: 'Failed to load market data' }, { status: 500 });
  }
}