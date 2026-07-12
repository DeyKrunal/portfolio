import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, GitBranch, Flame } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { RepoCard } from "@/components/common/RepoCard";
import { RepoCardSkeleton } from "@/components/common/RepoCardSkeleton";
import { siteConfig } from "@/config/site";
import { useSeo } from "@/hooks/useSeo";

export function HomePage() {
  useSeo({ title: "", path: "/" });
  const { data, isLoading, error } = useGithubSnapshot();
  const pinned = data?.repositories.filter((r) => r.isPinned).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 font-[--font-mono] text-xs uppercase tracking-[0.2em] text-[--color-accent-alt]"
        >
          {data ? `${data.profile.publicRepos} public repos · syncing live from GitHub` : "Loading profile"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="max-w-3xl text-balance font-[--font-display] text-[length:--text-4xl] font-semibold leading-[1.05] tracking-tight"
        >
          {data?.profile.name || siteConfig.siteName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-4 max-w-xl text-[length:--text-lg] text-[--color-text-muted]"
        >
          {data?.profile.bio || siteConfig.siteDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/projects"
            className="flex items-center gap-2 rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-medium text-[--color-accent-contrast] transition-transform hover:scale-[1.02]"
          >
            View projects <ArrowRight size={15} />
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-[--color-border] px-5 py-2.5 text-sm font-medium text-[--color-text] transition-colors hover:bg-[--color-bg-subtle]"
          >
            Get in touch
          </Link>
        </motion.div>

        {/* Live stats row */}
        {data && (
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[--radius-lg] border border-[--color-border] bg-[--color-border] sm:grid-cols-4">
            <Stat icon={<Star size={14} />} label="Total stars" value={data.totalStars} />
            <Stat icon={<Users size={14} />} label="Followers" value={data.profile.followers} />
            <Stat icon={<GitBranch size={14} />} label="Repositories" value={data.profile.publicRepos} />
            <Stat icon={<Flame size={14} />} label="Current streak" value={`${data.currentStreak}d`} />
          </div>
        )}

        {error != null && (
          <p className="mt-10 rounded-[--radius-md] border border-[--color-accent-warn]/30 bg-[--color-accent-warn]/5 px-4 py-3 text-sm text-[--color-accent-warn]">
            GitHub data hasn't synced yet. Run <code>npm run fetch:github</code> locally or wait
            for the "Sync GitHub Data" Action to complete.
          </p>
        )}
      </section>

      {/* Pinned projects */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-[--font-display] text-[length:--text-2xl] font-semibold tracking-tight">
            Pinned projects
          </h2>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-[--color-accent] hover:underline"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} />)}
          {pinned?.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[--color-surface] p-5">
      <div className="flex items-center gap-1.5 text-[--color-text-faint]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-[--font-display] text-[length:--text-2xl] font-semibold">
        {value}
      </p>
    </div>
  );
}
