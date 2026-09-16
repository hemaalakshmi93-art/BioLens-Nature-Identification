import { categoryMeta, type Category } from "@/data/species";

export function CategoryBadge({ category, size = "md" }: { category: Category; size?: "sm" | "md" }) {
  const meta = categoryMeta(category);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${meta.tone} ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      }`}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
