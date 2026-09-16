import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X, Sparkles, Bookmark, Check, RefreshCw, MapPin } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, DEMO_EXAMPLES, categoryMeta, speciesById } from "@/data/species";
import { engine, type IdentificationResult } from "@/lib/identification";
import { compressImage, saveDiscovery } from "@/lib/discoveries";
import { getLocation } from "@/lib/geo";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ConfidenceRing } from "@/components/ConfidenceRing";

export const Route = createFileRoute("/identify")({
  head: () => ({
    meta: [
      { title: "Identify a species — BioLens" },
      { name: "description", content: "Upload or capture a photo and let BioLens identify the flower, tree, leaf, insect or bird." },
      { property: "og:title", content: "Identify a species — BioLens" },
      { property: "og:description", content: "Upload a photo and identify nature with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdentifyPage,
});

type Stage = "idle" | "ready" | "analyzing" | "result";

interface Selected {
  src: string;
  name: string;
  hintSpeciesId?: string;
  hintConfidence?: number;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function IdentifyPage() {
  const [selected, setSelected] = useState<Selected | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCameraSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  useEffect(() => () => stopCamera(), []);

  function reset() {
    setSelected(null);
    setResult(null);
    setSaved(false);
    setStage("idle");
  }

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Unsupported image format. Please use JPG, PNG, WEBP or GIF.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("That image is larger than 12 MB. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelected({ src: String(reader.result), name: file.name });
      setResult(null);
      setSaved(false);
      setStage("ready");
    };
    reader.onerror = () => toast.error("Couldn't read that file. Please try another image.");
    reader.readAsDataURL(file);
  }

  function pickExample(id: string) {
    const ex = DEMO_EXAMPLES.find((e) => e.speciesId === id);
    if (!ex) return;
    const probe = new Image();
    probe.onload = () => {
      setSelected({ src: ex.image, name: ex.label, hintSpeciesId: ex.speciesId, hintConfidence: ex.confidence });
      setResult(null);
      setSaved(false);
      setStage("ready");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    probe.onerror = () => toast.error(`Sample image for ${ex.label} is missing.`);
    probe.src = ex.image;
  }

  async function identify() {
    if (!selected) {
      toast.error("Please select an image first.");
      return;
    }
    setStage("analyzing");
    try {
      const r = await engine.identify({
        imageSrc: selected.src,
        hintSpeciesId: selected.hintSpeciesId,
        hintConfidence: selected.hintConfidence,
      });
      setResult(r);
      setStage("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch {
      toast.error("Identification failed. Please try again.");
      setStage("ready");
    }
  }

  async function save() {
    if (!result || !selected || saved) return;
    setSaving(true);
    try {
      const [loc, image] = await Promise.all([getLocation(), compressImage(selected.src)]);
      const now = new Date();
      const res = saveDiscovery({
        id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
        image,
        category: result.species.category,
        english: result.species.english,
        tamil: result.species.tamil,
        scientific: result.species.scientific,
        confidence: result.confidence,
        date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        timestamp: now.getTime(),
        latitude: loc.latitude,
        longitude: loc.longitude,
        isDemoLocation: loc.isDemo,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Could not save discovery.");
        return;
      }
      setSaved(true);
      toast.success("Discovery saved! 🌿", {
        description: loc.isDemo ? "Location unavailable — demo coordinates near Pollachi were used." : "Saved with your current location.",
        action: { label: "View", onClick: () => (window.location.href = "/discoveries") },
      });
    } finally {
      setSaving(false);
    }
  }

  // ---- Camera ----
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      });
    } catch {
      toast.error("Camera unavailable or permission denied. You can upload an image instead.");
      setCameraOpen(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      toast.error("Camera is still starting. Try again in a second.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const src = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    setSelected({ src, name: "Camera capture" });
    setResult(null);
    setSaved(false);
    setStage("ready");
  }

  const species = result?.species;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="max-w-2xl animate-fade-up">
        <span className="eyebrow">Identify</span>
        <h1 className="mt-3 text-4xl font-semibold text-moss sm:text-5xl">Upload a photo</h1>
        <p className="mt-3 text-lg text-muted-foreground">Take a photo or choose an image from your device.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Upload / preview panel */}
        <section className="card-soft overflow-hidden p-4 sm:p-6" aria-label="Image selection">
          {cameraOpen ? (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-moss">
                <video ref={videoRef} playsInline muted className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={capture} className="btn-primary">
                  <Camera className="h-4 w-4" /> Capture Photo
                </button>
                <button type="button" onClick={stopCamera} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : !selected ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                dragOver ? "border-leaf bg-leaf-soft/60" : "border-border bg-muted/40"
              }`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-leaf-soft text-4xl shadow-soft">
                🌿
              </span>
              <h2 className="mt-6 text-2xl font-semibold text-foreground">Drop an image here</h2>
              <p className="mt-2 text-sm text-muted-foreground">JPG, PNG, WEBP or GIF · up to 12 MB</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload Image
                </button>
                {cameraSupported && (
                  <button type="button" className="btn-secondary" onClick={openCamera}>
                    <Camera className="h-4 w-4" /> Use Camera
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="sr-only"
                aria-label="Upload image"
                onChange={(e) => {
                  pickFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl bg-muted">
                <img src={selected.src} alt={`Selected: ${selected.name}`} className="aspect-[4/3] w-full object-cover" />
                {stage === "analyzing" && (
                  <div className="absolute inset-0 bg-moss/40 backdrop-blur-[2px]">
                    <div className="absolute inset-x-0 h-1 animate-scan bg-gradient-to-r from-transparent via-sun to-transparent shadow-[0_0_24px_4px_oklch(0.8_0.15_85/0.6)]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground">
                      <Sparkles className="h-8 w-8 animate-pulse-soft" />
                      <p className="mt-3 font-semibold">Analyzing image…</p>
                      <p className="text-xs opacity-80">Comparing against BioLens species dataset</p>
                    </div>
                  </div>
                )}
                {stage !== "analyzing" && (
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur hover:bg-card"
                  >
                    <X className="h-3.5 w-3.5" /> Remove / Change
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {stage !== "result" ? (
                  <button type="button" onClick={identify} disabled={stage === "analyzing"} className="btn-primary text-base">
                    <Sparkles className="h-4 w-4" />
                    {stage === "analyzing" ? "Analyzing…" : "Identify with AI"}
                  </button>
                ) : (
                  <button type="button" onClick={reset} className="btn-secondary">
                    <RefreshCw className="h-4 w-4" /> Identify another
                  </button>
                )}
                <span className="truncate text-sm text-muted-foreground">{selected.name}</span>
              </div>
            </div>
          )}
        </section>

        {/* Examples */}
        <section className="card-soft p-4 sm:p-6" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="text-xl font-semibold text-foreground">
            Try an Example
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Built-in samples that work offline — perfect for a quick demo.</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {DEMO_EXAMPLES.map((ex) => {
              const s = speciesById(ex.speciesId)!;
              const meta = categoryMeta(s.category);
              const active = selected?.hintSpeciesId === ex.speciesId;
              return (
                <li key={ex.speciesId}>
                  <button
                    type="button"
                    onClick={() => pickExample(ex.speciesId)}
                    aria-pressed={active}
                    className={`card-hover group flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left ${
                      active ? "border-leaf bg-leaf-soft/50" : "border-border bg-card"
                    }`}
                  >
                    <img
                      src={ex.image}
                      alt={ex.label}
                      width={56}
                      height={56}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">{ex.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {meta.emoji} {meta.label} · <span className="tamil">{s.tamil}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Result */}
      {stage === "result" && species && result && (
        <section ref={resultRef} className="mt-10 scroll-mt-24 animate-fade-up" aria-labelledby="result-heading">
          <div className="card-soft overflow-hidden">
            <div className="grid gap-8 bg-gradient-to-br from-card via-card to-leaf-soft/50 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="eyebrow">Identification Result</span>
                <div className="mt-4">
                  <CategoryBadge category={species.category} />
                </div>
                <h2 id="result-heading" className="mt-4 text-4xl font-semibold text-moss sm:text-5xl">
                  {species.english}
                </h2>
                <p className="tamil mt-2 text-3xl text-foreground sm:text-4xl">{species.tamil}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Scientific name: <span className="italic text-foreground">{species.scientific}</span>
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 md:pl-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Confidence</p>
                <ConfidenceRing value={result.confidence} />
                <p className="max-w-[200px] text-center text-xs text-muted-foreground">
                  Confidence indicates how strongly the prototype matches the selected image.
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-border p-6 sm:grid-cols-2 sm:p-10">
              <InfoBlock title="About" emoji="📖" text={species.about} />
              <InfoBlock title="Uses" emoji="🧺" text={species.uses} />
              <InfoBlock title="Ecological Importance" emoji="🌍" text={species.ecology} />
              <InfoBlock title="Safety" emoji="🛡️" text={species.safety} />
            </div>

            {species.similar.length > 0 && (
              <div className="border-t border-border px-6 pb-6 sm:px-10 sm:pb-10">
                <h3 className="pt-6 text-lg font-semibold text-foreground">Similar Species</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {species.similar.map((id) => {
                    const s = speciesById(id);
                    if (!s) return null;
                    const meta = categoryMeta(s.category);
                    return (
                      <li key={id} className="chip cursor-default">
                        <span aria-hidden="true">{meta.emoji}</span>
                        {s.english} <span className="tamil text-muted-foreground">{s.tamil}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 p-6 sm:px-10">
              <button type="button" onClick={save} disabled={saved || saving} className="btn-primary">
                {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {saved ? "Saved to My Discoveries" : saving ? "Saving…" : "Save to My Discoveries"}
              </button>
              {saved && (
                <Link to="/discoveries" className="btn-secondary">
                  View journal
                </Link>
              )}
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Location is attached when you save · engine: {result.engine}
              </span>
            </div>
          </div>
        </section>
      )}

      {stage === "idle" && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Categories: {CATEGORIES.map((c) => `${c.emoji} ${c.plural}`).join("  ·  ")}
        </p>
      )}
    </div>
  );
}

function InfoBlock({ title, emoji, text }: { title: string; emoji: string; text: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-5 ring-1 ring-border/60">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <span aria-hidden="true">{emoji}</span> {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
