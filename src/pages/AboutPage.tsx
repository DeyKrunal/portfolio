import { useGithubSnapshot } from "@/hooks/useGithub";
import { useSeo } from "@/hooks/useSeo";

export function AboutPage() {
  useSeo({ title: "About", path: "/about" });
  const { data } = useGithubSnapshot();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-semibold tracking-tight">
        About
      </h1>

      <div className="mt-8 flex items-start gap-5">
        {data?.profile.avatarUrl && (
          <img
            src={data.profile.avatarUrl}
            alt={data.profile.name ?? "Profile"}
            width={72}
            height={72}
            className="h-18 w-18 rounded-full"
          />
        )}
        <div>
          <p className="font-[--font-display] text-lg font-semibold">
            {data?.profile.name}
          </p>
          <p className="text-sm text-[--color-text-muted]">{data?.profile.bio}</p>
          {data?.profile.location && (
            <p className="mt-1 text-xs text-[--color-text-faint]">{data.profile.location}</p>
          )}
        </div>
      </div>

      <div className="prose prose-neutral mt-10 max-w-none text-[--color-text-muted]">
        <p>
          This section is managed from the Admin Dashboard (Settings → Personal Information) so
          it can hold a longer personal narrative — background, interests, how you got into
          engineering — without needing a code change. Wire it to the same Firestore document
          used for site settings once the Admin Dashboard (Phase 3) is in place.
        </p>
      </div>
    </section>
  );
}
