import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { EmptyState } from "@/components/common/EmptyState";
import { Lightbox } from "@/components/common/Lightbox";
import { useSeo } from "@/hooks/useSeo";
import type { GalleryItem } from "@/types/content";

export function GalleryPage() {
  useSeo({ title: "Gallery", path: "/gallery" });

  const { data: items, isLoading } = useFirestoreCollection<GalleryItem>("gallery", "order");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Gallery
      </h1>
      <p className="mt-2 text-[--color-text-muted]">
        Screenshots, talks, workspace shots, and anything else worth showing.
      </p>

      {isLoading && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />
          ))}
        </div>
      )}

      {!isLoading && (!items || items.length === 0) && (
        <div className="mt-8">
          <EmptyState
            icon={ImageIcon}
            title="Gallery is empty"
            description="Upload images or short videos from Admin → Gallery. They'll appear here in a responsive grid with a full-screen viewer."
          />
        </div>
      )}

      {items && items.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-[--radius-md] bg-[--color-bg-subtle]"
            >
              {item.mediaType === "video" ? (
                <video src={item.mediaUrl} muted className="h-full w-full object-cover" />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-medium text-white">{item.title}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {activeIndex !== null && items && (
        <Lightbox
          items={items}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </section>
  );
}
