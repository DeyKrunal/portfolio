import { Quote, MessageSquareQuote } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { TestimonialEntry } from "@/types/content";

export function TestimonialsPage() {
  useSeo({ title: "Testimonials", path: "/testimonials" });

  const { data: testimonials, isLoading } = useFirestoreCollection<TestimonialEntry>(
    "testimonials",
    "order"
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Testimonials
      </h1>

      {isLoading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!testimonials || testimonials.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={MessageSquareQuote}
            title="No testimonials yet"
            description="Add quotes from colleagues, managers, or clients from Admin → Testimonials."
          />
        </div>
      )}

      {testimonials && testimonials.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col gap-4 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-6"
            >
              <Quote size={20} className="text-[--color-accent]" />
              <blockquote className="flex-1 text-sm text-[--color-text-muted]">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.authorAvatarUrl && (
                  <img
                    src={t.authorAvatarUrl}
                    alt={t.authorName}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{t.authorName}</p>
                  <p className="text-xs text-[--color-text-faint]">
                    {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
