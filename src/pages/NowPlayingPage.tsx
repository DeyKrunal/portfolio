import { Music, Radio } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { EmptyState } from "@/components/common/EmptyState";
import { useSeo } from "@/hooks/useSeo";
import type { NowPlayingSettings } from "@/types/content";

export function NowPlayingPage() {
  useSeo({ title: "Now Playing", path: "/now-playing" });

  const { data, isLoading } = useFirestoreDoc<NowPlayingSettings>("settings", "nowPlaying");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        Now playing
      </h1>
      <p className="mt-2 text-[--color-text-muted]">
        Whatever's on repeat right now. Updated manually — no background service listening in.
      </p>

      {isLoading && (
        <div className="mt-8 h-24 animate-pulse rounded-[--radius-lg] bg-[--color-bg-subtle]" />
      )}

      {!isLoading && (!data || !data.enabled || !data.trackName) && (
        <div className="mt-8">
          <EmptyState
            icon={Music}
            title="Nothing set right now"
            description="Set the current track from Admin → Settings → Now Playing. Supports a manual entry, or wiring to Spotify/Last.fm later."
          />
        </div>
      )}

      {data?.enabled && data.trackName && (
        <div className="mt-8 flex items-center gap-4 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
          {data.albumArtUrl ? (
            <img
              src={data.albumArtUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-[--radius-md] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-md] bg-[--color-bg-subtle]">
              <Radio size={20} className="text-[--color-text-faint]" />
            </div>
          )}
          <div>
            <p className="font-[--font-display] font-semibold">{data.trackName}</p>
            <p className="text-sm text-[--color-text-muted]">{data.artistName}</p>
            {data.trackUrl && (
              <a
                href={data.trackUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-[--color-accent] hover:underline"
              >
                Open track
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
