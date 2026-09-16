import type { Category } from "@/data/species";

export interface Discovery {
  id: string;
  image: string;
  category: Category;
  english: string;
  tamil: string;
  scientific: string;
  confidence: number;
  date: string; // e.g. 04 Sep 2026
  time: string; // e.g. 13:24
  timestamp: number;
  latitude: number;
  longitude: number;
  isDemoLocation: boolean;
}

const KEY = "biolens.discoveries.v1";
const VALID_CATEGORIES = new Set(["flower", "tree", "leaf", "insect", "bird"]);

function isDiscovery(d: unknown): d is Discovery {
  if (!d || typeof d !== "object") return false;
  const o = d as Partial<Discovery>;
  return (
    typeof o.id === "string" &&
    typeof o.image === "string" &&
    typeof o.category === "string" &&
    VALID_CATEGORIES.has(o.category) &&
    typeof o.english === "string" &&
    typeof o.latitude === "number" &&
    typeof o.longitude === "number"
  );
}

export function loadDiscoveries(): Discovery[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDiscovery).sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  } catch {
    return [];
  }
}

export function saveDiscovery(d: Discovery): { ok: boolean; error?: string } {
  try {
    const list = loadDiscoveries();
    list.unshift(d);
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return { ok: true };
  } catch {
    return { ok: false, error: "Storage is full. Try removing an older discovery." };
  }
}

export function deleteDiscovery(id: string): Discovery[] {
  const list = loadDiscoveries().filter((d) => d.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return list;
}

export function clearDiscoveries() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Shrinks an image to keep LocalStorage small (~50 KB per image). */
export async function compressImage(src: string, max = 480): Promise<string> {
  if (!src.startsWith("data:")) return src; // public sample images stay as paths
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("load"));
      img.src = src;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return src;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.75);
  } catch {
    return src;
  }
}
