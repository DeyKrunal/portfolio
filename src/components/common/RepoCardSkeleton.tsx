export function RepoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-[--color-bg-subtle]" />
      <div className="h-3 w-full animate-pulse rounded bg-[--color-bg-subtle]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-[--color-bg-subtle]" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[--color-bg-subtle]" />
    </div>
  );
}
