export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="bl-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="oklch(0.62 0.14 148)" />
          <stop offset="1" stopColor="oklch(0.42 0.1 155)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#bl-grad)" />
      <circle cx="24" cy="24" r="12.5" stroke="oklch(0.985 0.012 95)" strokeWidth="2.5" />
      <path
        d="M24 15.5c-5 2.5-7 7-6 12 5-1 8.5-4.5 6-12z"
        fill="oklch(0.985 0.012 95)"
        transform="rotate(20 24 24)"
      />
      <path d="M21 27.5c1.2-3.2 2.6-5.4 4.8-7.6" stroke="oklch(0.55 0.13 150)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="33" cy="15" r="2.5" fill="oklch(0.95 0.06 90)" />
    </svg>
  );
}
