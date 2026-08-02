import { Link } from "react-router-dom";
import { Briefcase, GitBranch, Users, Award } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useCountUp } from "@/hooks/useCountUp";
import { useSeo } from "@/hooks/useSeo";
import type { CertificateEntry } from "@/types/content";

export function AboutPage() {
  useSeo({ title: "About", path: "/about" });
  const { data } = useGithubSnapshot();
  const { data: certificates } = useFirestoreCollection<CertificateEntry>("certificates", "order");

  const yearsExperience = data
    ? Math.max(1, new Date().getFullYear() - new Date(data.profile.createdAt).getFullYear())
    : null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
        Get to know me
      </p>
      <h1 className="font-[--font-display] text-[length:--text-3xl] font-bold tracking-tight">
        About
      </h1>

      <div className="mt-8 flex items-start gap-5">
        {data?.profile.avatarUrl && (
          <img
            src={data.profile.avatarUrl}
            alt={data.profile.name ?? "Profile"}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border border-[--color-border]"
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

      {/* Real stats only -- no fabricated numbers like "happy clients" without
          a genuine source. Everything here is derived from GitHub or the
          certificates collection. */}
      {data && (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Briefcase size={15} />} label="Years on GitHub" value={yearsExperience ?? 0} />
          <StatCard icon={<GitBranch size={15} />} label="Projects" value={data.profile.publicRepos} />
          <StatCard icon={<Users size={15} />} label="Contributions" value={data.contributionCalendar.totalContributions} />
          <StatCard icon={<Award size={15} />} label="Certifications" value={certificates?.length ?? 0} />
        </div>
      )}

      <div className="prose prose-neutral mt-10 max-w-none text-[--color-text-muted]">
        <p>
          This section is managed from the Admin Dashboard (Settings → Personal Information) so
          it can hold a longer personal narrative — background, interests, how you got into
          engineering — without needing a code change.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/experience"
          className="btn-secondary rounded-full px-5 py-2.5 text-sm font-medium"
        >
          Career journey →
        </Link>
        <Link
          to="/education"
          className="btn-secondary rounded-full px-5 py-2.5 text-sm font-medium"
        >
          Education →
        </Link>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const animated = useCountUp(value);
  return (
    <div className="card-premium p-4">
      <div className="flex items-center gap-1.5 text-[--color-accent-from]">{icon}</div>
      <p className="mt-2 font-[--font-display] text-xl font-bold">{animated.toLocaleString()}</p>
      <p className="text-xs text-[--color-text-faint]">{label}</p>
    </div>
  );
}
