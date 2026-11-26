'use client';

import { useEffect, useRef } from 'react';
import type L from 'leaflet';

export interface MapZonePoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  stallCount: number;
}

export default function MarketMap({
  zones,
  selectedZoneId,
  onSelectZone,
}: {
  zones: MapZonePoint[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const leafletRef = useRef<typeof L | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectZone);

  useEffect(() => {
    onSelectRef.current = onSelectZone;
  }, [onSelectZone]);

  // 1. 只在组件首次加载时初始化一次地图，避免重复销毁触发 _leaflet_pos 报错
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const leaflet = (await import('leaflet')).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      leafletRef.current = leaflet;
      const map = leaflet.map(containerRef.current, {
        zoomAnimation: false,
        fadeAnimation: false,
      }).setView([55.8455, -4.4235], 15);

      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        })
        .addTo(map);

      layerGroupRef.current = leaflet.layerGroup().addTo(map);
      mapRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.stop();
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // 2. 数据或选中区域变化时，只刷新圆点标记，不重建地图
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    function renderMarkers() {
      const leaflet = leafletRef.current;
      const map = mapRef.current;
      const group = layerGroupRef.current;

      if (!leaflet || !map || !group) {
        timer = setTimeout(renderMarkers, 100);
        return;
      }

      group.clearLayers();

      zones.forEach((zone) => {
        const isSelected = zone.id === selectedZoneId;
        const marker = leaflet.circleMarker([zone.lat, zone.lng], {
          radius: isSelected ? 13 : 10,
          fillColor: isSelected ? '#b91c1c' : '#065f46',
          color: '#fbbf24',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.92,
        });

        marker.bindPopup(
          `<div style="font-family:sans-serif;">
            <strong>${zone.name}</strong><br/>
            <span style="font-size:12px;color:#555;">${zone.address}</span><br/>
            <span style="font-size:12px;color:#065f46;font-weight:600;">${zone.stallCount} matching chalet(s)</span>
          </div>`
        );

        marker.on('click', () => onSelectRef.current(zone.id));
        marker.addTo(group);

        if (isSelected) {
          marker.openPopup();
          map.setView([zone.lat, zone.lng], map.getZoom(), { animate: false });
        }
      });
    }

    renderMarkers();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [zones, selectedZoneId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] rounded-2xl border border-emerald-900/15 shadow-sm overflow-hidden z-0"
    />
  );
}