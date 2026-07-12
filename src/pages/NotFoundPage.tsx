import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="font-[--font-mono] text-sm text-[--color-accent-warn]">404</p>
      <h1 className="mt-3 font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        This page hasn't been pushed yet
      </h1>
      <p className="mt-3 text-[--color-text-muted]">
        The route you're looking for doesn't exist. It may have been moved or renamed.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-medium text-[--color-accent-contrast]"
      >
        Back to home
      </Link>
    </section>
  );
}
