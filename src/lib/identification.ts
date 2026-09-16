/**
 * BioLens identification engine.
 *
 * This is a LIGHTWEIGHT PROTOTYPE. It does not contain a trained neural
 * network. It works in two ways:
 *   1. Demo examples  → the known species is returned with a demo score.
 *   2. Uploaded photo → dominant colours of the image are sampled and
 *      matched against `colorHints` in the dataset.
 *
 * To connect a real model (TensorFlow.js, Teachable Machine, a vision API,
 * a custom CNN/ViT…), implement `IdentificationEngine` and swap
 * `engine` below. The UI only depends on this interface.
 */

import { SPECIES, speciesById, type Species } from "@/data/species";

export interface IdentificationResult {
  species: Species;
  confidence: number; // 0–100 prototype score
  engine: string;
}

export interface IdentificationInput {
  imageSrc: string; // data URL or public path
  hintSpeciesId?: string | undefined; // set when a demo example was chosen
  hintConfidence?: number | undefined;
}

export interface IdentificationEngine {
  name: string;
  identify(input: IdentificationInput): Promise<IdentificationResult>;
}

type Hue = Species["colorHints"][number];

function classifyPixel(r: number, g: number, b: number): Hue | null {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const light = (max + min) / 2 / 255;
  if (light > 0.9 && sat < 0.15) return "white";
  if (sat < 0.18) return null; // grey / background
  if (r > 150 && g < 110 && b < 120) return "red";
  if (r > 170 && g < 150 && b > 130) return "pink";
  if (r > 170 && g > 140 && b < 110) return "yellow";
  if (g > r && g > b) return "green";
  if (b > r && b > g) return "blue";
  if (r > g && g > b && r < 190) return "brown";
  return null;
}

async function sampleColors(src: string): Promise<Record<Hue, number>> {
  const counts: Record<Hue, number> = { red: 0, yellow: 0, green: 0, blue: 0, brown: 0, white: 0, pink: 0 };
  if (typeof document === "undefined") return counts;
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return counts;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < data.length; i += 4) {
    const hue = classifyPixel(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0);
    if (hue) counts[hue] += 1;
  }
  return counts;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const prototypeEngine: IdentificationEngine = {
  name: "BioLens Prototype Matcher v0.1",
  async identify({ imageSrc, hintSpeciesId, hintConfidence }) {
    await delay(1800); // simulate analysis time for the loading animation

    if (hintSpeciesId) {
      const species = speciesById(hintSpeciesId);
      if (species) return { species, confidence: hintConfidence ?? 90, engine: this.name };
    }

    let counts: Record<Hue, number> | null = null;
    try {
      counts = await sampleColors(imageSrc);
    } catch {
      counts = null;
    }

    let best: Species = SPECIES[0]!;
    let bestScore = -1;
    if (counts) {
      const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
      for (const s of SPECIES) {
        const score = s.colorHints.reduce((acc, h) => acc + counts![h] / total, 0) / s.colorHints.length;
        // tiny deterministic tie-breaker so results are stable
        const jitter = (s.id.length % 7) / 1000;
        if (score + jitter > bestScore) {
          bestScore = score + jitter;
          best = s;
        }
      }
    }
    const confidence = Math.round(Math.min(88, Math.max(68, 62 + bestScore * 40)));
    return { species: best, confidence, engine: this.name };
  },
};

/** Active engine — replace with a real model adapter later. */
export const engine: IdentificationEngine = prototypeEngine;
