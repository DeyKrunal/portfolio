export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[--color-border] border-t-[--color-accent]" />
    </div>
  );
}
