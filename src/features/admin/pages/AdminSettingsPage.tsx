import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useSetSettingsDoc } from "@/features/admin/hooks/useFirestoreMutations";
import { ImageDropField } from "@/features/admin/components/ImageDropField";
import { cn } from "@/lib/cn";

const TABS = ["Personal", "Social", "Resume", "Now Playing"] as const;
type Tab = (typeof TABS)[number];

export function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("Personal");

  return (
    <div>
      <h1 className="font-[--font-display] text-xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-[--color-text-muted]">
        These write to Firestore documents under <code>settings/*</code>, read by the public site.
      </p>

      <div className="mt-6 flex gap-1 border-b border-[--color-border]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium",
              tab === t
                ? "border-[--color-accent] text-[--color-accent]"
                : "border-transparent text-[--color-text-muted] hover:text-[--color-text]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-lg">
        {tab === "Personal" && <PersonalSettings />}
        {tab === "Social" && <SocialSettings />}
        {tab === "Resume" && <ResumeSettingsForm />}
        {tab === "Now Playing" && <NowPlayingSettingsForm />}
      </div>
    </div>
  );
}

function SaveButton({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-contrast] disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {saved && !pending && <Check size={14} />}
      Save
    </button>
  );
}

interface PersonalDoc {
  bio: string;
  location: string;
  availableForWork: boolean;
}

function PersonalSettings() {
  const { data, isLoading } = useFirestoreDoc<PersonalDoc>("settings", "personal");
  const mutation = useSetSettingsDoc("personal");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [availableForWork, setAvailableForWork] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setBio(data.bio ?? "");
      setLocation(data.location ?? "");
      setAvailableForWork(data.availableForWork ?? false);
    }
  }, [data]);

  if (isLoading) return <div className="h-40 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />;

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaved(false);
        await mutation.mutateAsync({ bio, location, availableForWork });
        setSaved(true);
      }}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">Bio</label>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={availableForWork}
          onChange={(e) => setAvailableForWork(e.target.checked)}
          className="h-4 w-4 rounded border-[--color-border]"
        />
        Available for work
      </label>
      <SaveButton pending={mutation.isPending} saved={saved} />
    </form>
  );
}

interface SocialDoc {
  linkedin: string;
  twitter: string;
  email: string;
}

function SocialSettings() {
  const { data, isLoading } = useFirestoreDoc<SocialDoc>("settings", "social");
  const mutation = useSetSettingsDoc("social");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setLinkedin(data.linkedin ?? "");
      setTwitter(data.twitter ?? "");
      setEmail(data.email ?? "");
    }
  }, [data]);

  if (isLoading) return <div className="h-40 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />;

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaved(false);
        await mutation.mutateAsync({ linkedin, twitter, email });
        setSaved(true);
      }}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium">LinkedIn URL</label>
        <input
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Twitter / X URL</label>
        <input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Public contact email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <p className="text-xs text-[--color-text-faint]">
        These links power the live footer (fetched via a lightweight public
        Firestore REST read, not the SDK, so it doesn't add Firebase to every
        page's bundle). The GitHub icon always points at your GitHub profile
        and isn't editable here -- it comes from{" "}
        <code>src/config/site.ts</code>.
      </p>
      <SaveButton pending={mutation.isPending} saved={saved} />
    </form>
  );
}

interface ResumeDoc {
  resumeUrl: string;
}

function ResumeSettingsForm() {
  const { data, isLoading } = useFirestoreDoc<ResumeDoc>("settings", "resume");
  const mutation = useSetSettingsDoc("resume");
  const [resumeUrl, setResumeUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setResumeUrl(data.resumeUrl ?? "");
  }, [data]);

  if (isLoading) return <div className="h-40 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />;

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaved(false);
        await mutation.mutateAsync({ resumeUrl });
        setSaved(true);
      }}
    >
      <ImageDropField
        label="Resume PDF"
        value={resumeUrl}
        onChange={setResumeUrl}
        accept="application/pdf"
      />
      <p className="text-xs text-[--color-text-faint]">
        Upload a PDF directly (up to 20MB, per storage.rules), or switch to "Paste URL" to point at
        a resume committed to the repo's <code>public/</code> folder instead.
      </p>
      <SaveButton pending={mutation.isPending} saved={saved} />
    </form>
  );
}

interface NowPlayingDoc {
  enabled: boolean;
  trackName: string;
  artistName: string;
  trackUrl: string;
  albumArtUrl: string;
}

function NowPlayingSettingsForm() {
  const { data, isLoading } = useFirestoreDoc<NowPlayingDoc>("settings", "nowPlaying");
  const mutation = useSetSettingsDoc("nowPlaying");
  const [enabled, setEnabled] = useState(false);
  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [albumArtUrl, setAlbumArtUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setEnabled(data.enabled ?? false);
      setTrackName(data.trackName ?? "");
      setArtistName(data.artistName ?? "");
      setTrackUrl(data.trackUrl ?? "");
      setAlbumArtUrl(data.albumArtUrl ?? "");
    }
  }, [data]);

  if (isLoading) return <div className="h-40 animate-pulse rounded-[--radius-md] bg-[--color-bg-subtle]" />;

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaved(false);
        await mutation.mutateAsync({
          enabled,
          trackName,
          artistName,
          trackUrl,
          albumArtUrl,
          provider: "manual",
        });
        setSaved(true);
      }}
    >
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-[--color-border]"
        />
        Show "Now Playing" on the site
      </label>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Track name</label>
        <input
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Artist</label>
        <input
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Track URL</label>
        <input
          value={trackUrl}
          onChange={(e) => setTrackUrl(e.target.value)}
          className="w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-3 py-2 text-sm outline-none focus-visible:border-[--color-accent]"
        />
      </div>
      <ImageDropField label="Album art" value={albumArtUrl} onChange={setAlbumArtUrl} />
      <SaveButton pending={mutation.isPending} saved={saved} />
    </form>
  );
}
