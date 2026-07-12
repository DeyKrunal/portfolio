import { useSeo } from "@/hooks/useSeo";

export function TermsPage() {
  useSeo({ title: "Terms of Use", path: "/terms" });

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Terms of Use
      </h1>
      <div className="prose prose-neutral mt-8 max-w-none space-y-4 text-sm text-[--color-text-muted]">
        <p>Last updated: {new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</p>

        <p>
          This site is a personal portfolio provided as-is, for informational purposes. Project
          data is pulled automatically from public GitHub repositories and may occasionally lag
          behind the live state of those repositories by a few hours.
        </p>

        <p>
          Content, code snippets, and written posts on this site are the author's own work unless
          otherwise credited, and are shared for reference — reuse of substantial portions without
          attribution isn't authorized.
        </p>

        <p>
          Linked third-party sites (GitHub, LinkedIn, project demos) are outside this site's
          control and governed by their own terms.
        </p>
      </div>
    </section>
  );
}
