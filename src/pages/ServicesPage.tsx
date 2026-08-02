import { Wrench } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { ServiceEntry } from "@/types/content";

export function ServicesPage() {
  useSeo({ title: "Services", path: "/services" });

  const { data: services, isLoading } = useFirestoreCollection<ServiceEntry>(
    "services",
    "order"
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
        How I can help
      </p>
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-bold tracking-tight">
        Services
      </h1>
      <p className="mt-2 max-w-lg text-[--color-text-muted]">
        A snapshot of the kinds of engagements I take on, from a single feature to a full
        architecture.
      </p>

      {isLoading && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!services || services.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={Wrench}
            title="No services listed yet"
            description="Add service offerings from Admin → Services."
          />
        </div>
      )}

      {services && services.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="card-premium p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[--color-accent-from]/10 to-[--color-accent-to]/10">
                {service.iconUrl ? (
                  <img src={service.iconUrl} alt="" className="h-6 w-6 object-contain" />
                ) : (
                  <Wrench size={18} className="text-[--color-accent-from]" />
                )}
              </div>
              <h2 className="mt-4 font-[--font-display] text-base font-semibold">
                {service.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[--color-text-muted]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
