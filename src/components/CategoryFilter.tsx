import { CATEGORIES, type Category } from "@/data/species";

export type FilterValue = "all" | Category;

export function CategoryFilter({
  value,
  onChange,
  counts,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
  counts?: Partial<Record<FilterValue, number>>;
}) {
  const options: { id: FilterValue; label: string; emoji?: string }[] = [
    { id: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ id: c.id as FilterValue, label: c.plural, emoji: c.emoji })),
  ];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`chip ${value === o.id ? "chip-active" : ""}`}
        >
          {o.emoji && <span aria-hidden="true">{o.emoji}</span>}
          {o.label}
          {counts && counts[o.id] !== undefined && (
            <span className={`ml-0.5 text-xs ${value === o.id ? "opacity-80" : "text-muted-foreground"}`}>
              {counts[o.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
