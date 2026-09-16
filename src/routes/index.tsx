import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Sparkles, BookOpen, Bookmark } from "lucide-react";
import { CATEGORIES } from "@/data/species";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BioLens — Discover. Identify. Learn." },
      {
        name: "description",
        content: "Use AI to identify flowers, trees, leaves, insects and birds around you with BioLens.",
      },
      { property: "og:title", content: "BioLens — Discover. Identify. Learn." },
      { property: "og:description", content: "AI-powered nature identification and learning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: Camera, title: "Capture", text: "Upload or take a photo." },
  { icon: Sparkles, title: "Identify", text: "BioLens analyzes the image." },
  { icon: BookOpen, title: "Learn", text: "Explore useful information." },
  { icon: Bookmark, title: "Save", text: "Add the discovery to your nature journal." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pb-24 md:pt-20">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> AI nature identification
            </span>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-moss sm:text-6xl lg:text-7xl">
              Discover.
              <br />
              Identify.
              <br />
              <span className="text-leaf">Learn.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Use AI to identify flowers, trees, leaves, insects and birds around you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/identify" className="btn-primary text-base">
                Identify Something <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/discoveries" className="btn-secondary text-base">
                My Discoveries
              </Link>
            </div>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              “BioLens helps you recognize the natural world around you and learn about the species you discover.”
            </p>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="relative overflow-hidden rounded-4xl shadow-lift ring-1 ring-border">
              <img
                src="/images/hero.jpg"
                alt="Sunlit tropical foliage with pale flowers"
                width={1280}
                height={960}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-card/90 p-3 shadow-soft backdrop-blur">
                <img
                  src="/images/hibiscus.jpg"
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">🌸 Flower · 94%</p>
                  <p className="truncate font-semibold text-foreground">
                    Hibiscus <span className="tamil text-muted-foreground">· செம்பருத்தி</span>
                  </p>
                  <p className="truncate text-xs italic text-muted-foreground">Hibiscus rosa-sinensis</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden animate-float rounded-2xl bg-card px-4 py-3 shadow-lift ring-1 ring-border sm:block">
              <p className="text-2xl">🦋</p>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden animate-float rounded-2xl bg-card px-4 py-3 shadow-lift ring-1 ring-border [animation-delay:1.5s] sm:block">
              <p className="text-2xl">🐦</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="categories-heading">
        <div className="text-center">
          <span className="eyebrow justify-center">Five categories</span>
          <h2 id="categories-heading" className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
            What can BioLens identify?
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <Link
                to="/identify"
                className="card-soft card-hover flex flex-col items-center gap-3 px-4 py-8 text-center"
              >
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${c.tone}`}>
                  {c.emoji}
                </span>
                <span className="font-semibold text-foreground">{c.plural}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="how-heading">
        <div className="card-soft overflow-hidden bg-gradient-to-br from-card to-leaf-soft/40 p-8 sm:p-12">
          <div className="max-w-xl">
            <span className="eyebrow">Simple by design</span>
            <h2 id="how-heading" className="mt-3 text-3xl font-semibold text-moss sm:text-4xl">
              How BioLens Works
            </h2>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl bg-card/80 p-6 ring-1 ring-border">
                <span className="absolute right-5 top-4 font-display text-4xl font-semibold text-leaf/30">
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Link to="/identify" className="btn-primary">
              Start identifying <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
