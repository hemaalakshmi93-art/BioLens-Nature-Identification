import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { loadDiscoveries, type Discovery } from "@/lib/discoveries";
import { CategoryFilter, type FilterValue } from "@/components/CategoryFilter";

const DiscoveryMap = lazy(() => import("@/components/DiscoveryMap"));

export const Route = createFileRoute("/map")({
  validateSearch: (s: Record<string, unknown>) => ({
    focus: typeof s["focus"] === "string" ? s["focus"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Discovery Map — BioLens" },
      { name: "description", content: "See where you discovered each flower, tree, leaf, insect and bird on an interactive map." },
      { property: "og:title", content: "Discovery Map — BioLens" },
      { property: "og:description", content: "Your discoveries, mapped." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { focus } = Route.useSearch();
  const [items, setItems] = useState<Discovery[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    setItems(loadDiscoveries());
    setLoaded(true);
  }, []);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((d) => d.category === filter)), [items, filter]);
  const hasDemo = items.some((d) => d.isDemoLocation);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl animate-fade-up">
          <span className="eyebrow">Where you explored</span>
          <h1 className="mt-3 text-4xl font-semibold text-moss sm:text-5xl">Discovery Map</h1>
          <p className="mt-3 text-lg text-muted-foreground">Every saved discovery, pinned where you found it.</p>
        </div>
        <CategoryFilter value={filter} onChange={setFilter} />
      </div>

      {hasDemo && (
        <p className="mt-6 inline-flex items-start gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-sm text-bark">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Some markers use demo/fallback coordinates around Pollachi because device location was unavailable when they
          were saved.
        </p>
      )}

      <div className="card-soft mt-6 overflow-hidden">
        <div className="h-[520px] w-full bg-muted sm:h-[600px]">
          <ClientOnly fallback={<MapSkeleton />}>
            <Suspense fallback={<MapSkeleton />}>
              <DiscoveryMap discoveries={visible} focusId={focus} />
            </Suspense>
          </ClientOnly>
        </div>
      </div>

      {loaded && items.length === 0 && (
        <div className="card-soft mt-6 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <span className="text-4xl">🗺️</span>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">No discoveries to map yet</h2>
            <p className="text-sm text-muted-foreground">Identify and save a species — it will appear here as a marker.</p>
          </div>
          <Link to="/identify" className="btn-primary">
            <Sparkles className="h-4 w-4" /> Identify Something
          </Link>
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-leaf-soft/40 text-sm text-muted-foreground">
      <span className="animate-pulse-soft">Loading map…</span>
    </div>
  );
}
