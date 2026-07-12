import { lazy, Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";

const CommandPalette = lazy(() =>
  import("@/components/common/CommandPalette").then((m) => ({ default: m.CommandPalette }))
);

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search (Ctrl+K)"
        className="flex items-center gap-2 rounded-full border border-[--color-border] bg-[--color-surface] px-3 py-1.5 text-xs text-[--color-text-faint] transition-colors hover:border-[--color-border-strong] hover:text-[--color-text]"
      >
        <Search size={13} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-[--color-border] px-1.5 py-0.5 font-[--font-mono] text-[10px] sm:inline">
          {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {open && (
        <Suspense fallback={null}>
          <CommandPalette onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
