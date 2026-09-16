import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="font-display text-base font-semibold text-moss">BioLens</span>
          <span className="hidden sm:inline">· Discover. Identify. Learn.</span>
        </div>
        <p className="text-center">Student prototype · identification engine is a lightweight demo matcher.</p>
      </div>
    </footer>
  );
}
