import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trash2, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, type Category } from "@/data/species";
import { deleteDiscovery, loadDiscoveries, type Discovery } from "@/lib/discoveries";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryFilter, type FilterValue } from "@/components/CategoryFilter";

export const Route = createFileRoute("/discoveries")({
  head: () => ({
    meta: [
      { title: "My Discoveries — BioLens" },
      { name: "description", content: "Your personal nature journal of identified flowers, trees, leaves, insects and birds." },
      { property: "og:title", content: "My Discoveries — BioLens" },
      { property: "og:description", content: "Your personal record of the natural world you've explored." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiscoveriesPage,
});

function DiscoveriesPage() {
  const [items, setItems] = useState<Discovery[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    setItems(loadDiscoveries());
    setLoaded(true);
  }, []);

  const counts = useMemo(() => {
    const c: Record<FilterValue, number> = { all: items.length, flower: 0, tree: 0, leaf: 0, insect: 0, bird: 0 };
    for (const d of items) c[d.category] += 1;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((d) => d.category === filter);

  function remove(id: string) {
    setItems(deleteDiscovery(id));
    toast("Discovery removed.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl animate-fade-up">
          <span className="eyebrow">Nature journal</span>
          <h1 className="mt-3 text-4xl font-semibold text-moss sm:text-5xl">My Discoveries</h1>
          <p className="mt-3 text-lg text-muted-foreground">“Your personal record of the natural world you've explored.”</p>
        </div>
        <Link to="/identify" className="btn-primary self-start md:self-auto">
          <Sparkles className="h-4 w-4" /> Identify Something
        </Link>
      </div>

      {/* Stats */}
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <li className="card-soft bg-primary p-4 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total Discoveries</p>
          <p className="mt-1 font-display text-3xl font-semibold">{counts.all}</p>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.id} className="card-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {c.emoji} {c.plural}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold text-moss">{counts[c.id as Category]}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <CategoryFilter value={filter} onChange={setFilter} />
      </div>

      {!loaded ? null : items.length === 0 ? (
        <EmptyState />
      ) : visible.length === 0 ? (
        <div className="card-soft mt-8 p-10 text-center text-muted-foreground">No discoveries in this category yet.</div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d, i) => (
            <li key={d.id} className="card-soft card-hover animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="relative">
                <img
                  src={d.image}
                  alt={`${d.english} (${d.tamil})`}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-muted object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
                  }}
                />
                <div className="absolute left-3 top-3">
                  <CategoryBadge category={d.category} size="sm" />
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-bold text-moss shadow-soft backdrop-blur">
                  {d.confidence}%
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{d.english}</h2>
                <p className="tamil text-lg text-primary">{d.tamil}</p>
                <p className="mt-0.5 text-xs italic text-muted-foreground">{d.scientific}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {d.date} · {d.time}
                  </span>
                  <span className="inline-flex items-center gap-1" title={d.isDemoLocation ? "Demo location" : "GPS location"}>
                    <MapPin className="h-3.5 w-3.5" />
                    {d.isDemoLocation ? "Demo" : "GPS"}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/map" search={{ focus: d.id }} className="chip flex-1 justify-center">
                    View on map
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(d.id)}
                    className="chip hover:!border-destructive hover:!text-destructive"
                    aria-label={`Remove ${d.english}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-soft mt-8 flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-leaf-soft text-4xl">🌱</span>
      <h2 className="mt-6 text-2xl font-semibold text-foreground">No discoveries yet.</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">“Start exploring nature and your discoveries will appear here.”</p>
      <Link to="/identify" className="btn-primary mt-6">
        Identify Something
      </Link>
    </div>
  );
}
