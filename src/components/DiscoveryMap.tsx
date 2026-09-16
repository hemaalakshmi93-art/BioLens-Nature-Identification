import { useEffect, useRef } from "react";
import L from "leaflet";
import { categoryMeta } from "@/data/species";
import type { Discovery } from "@/lib/discoveries";
import { POLLACHI } from "@/lib/geo";

const MARKER_COLORS: Record<string, string> = {
  flower: "oklch(0.66 0.18 15)",
  tree: "oklch(0.36 0.07 152)",
  leaf: "oklch(0.6 0.14 148)",
  insect: "oklch(0.75 0.14 80)",
  bird: "oklch(0.65 0.11 235)",
};

function markerIcon(d: Discovery) {
  const meta = categoryMeta(d.category);
  return L.divIcon({
    className: "",
    html: `<div style="width:40px;height:40px;border-radius:14px 14px 14px 3px;transform:rotate(-45deg);background:${MARKER_COLORS[d.category]};box-shadow:0 8px 18px -6px rgba(0,0,0,.35);border:3px solid white;display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:18px;line-height:1">${meta.emoji}</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function popupHtml(d: Discovery) {
  const meta = categoryMeta(d.category);
  return `
    <div style="font-family:inherit">
      <img src="${d.image}" alt="${escapeHtml(d.english)}" style="width:100%;height:130px;object-fit:cover;display:block" />
      <div style="padding:12px 14px 14px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3f7a52">${meta.emoji} ${meta.label}</div>
        <div style="font-size:16px;font-weight:700;margin-top:4px;color:#1f3326">${escapeHtml(d.english)}</div>
        <div style="font-family:'Noto Sans Tamil',sans-serif;font-size:15px;color:#3f7a52">${escapeHtml(d.tamil)}</div>
        <div style="font-size:11px;color:#6b7a6e;margin-top:6px">${escapeHtml(d.date)} · ${escapeHtml(d.time)}${d.isDemoLocation ? " · demo location" : ""}</div>
      </div>
    </div>`;
}

export default function DiscoveryMap({ discoveries, focusId }: { discoveries: Discovery[]; focusId?: string | undefined }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: true }).setView(
      [POLLACHI.latitude, POLLACHI.longitude],
      13,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (discoveries.length === 0) {
      map.setView([POLLACHI.latitude, POLLACHI.longitude], 13);
      return;
    }
    const markers = discoveries.map((d) => {
      const m = L.marker([d.latitude, d.longitude], { icon: markerIcon(d), title: d.english });
      m.bindPopup(popupHtml(d), { maxWidth: 240, minWidth: 220 });
      layer.addLayer(m);
      return { d, m };
    });
    const focused = focusId ? markers.find((x) => x.d.id === focusId) : undefined;
    if (focused) {
      map.setView([focused.d.latitude, focused.d.longitude], 15);
      setTimeout(() => focused.m.openPopup(), 250);
    } else {
      const bounds = L.latLngBounds(discoveries.map((d) => [d.latitude, d.longitude] as [number, number]));
      map.fitBounds(bounds.pad(0.3), { maxZoom: 15 });
    }
  }, [discoveries, focusId]);

  return <div ref={containerRef} className="h-full w-full" role="region" aria-label="Discovery map" />;
}
