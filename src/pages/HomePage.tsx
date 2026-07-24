import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, GitBranch, Flame } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { RepoCard } from "@/components/common/RepoCard";
import { RepoCardSkeleton } from "@/components/common/RepoCardSkeleton";
import { SyncTerminal } from "@/components/common/SyncTerminal";
import { siteConfig } from "@/config/site";
import { useSeo } from "@/hooks/useSeo";

export function HomePage() {
  useSeo({ title: "", path: "/" });
  const { data, isLoading, error } = useGithubSnapshot();
  const pinned = data?.repositories.filter((r) => r.isPinned).slice(0, 6);

  // A short hex string derived from real synced data, not a random fake --
  // it changes when the underlying numbers change, so it reads as a build
  // artifact ID rather than decoration.
  const buildHash = data
    ? (data.totalStars + data.profile.publicRepos * 7).toString(16).padStart(6, "0").slice(-6)
    : "------";

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 flex flex-wrap items-center gap-2"
            >
              <span className="rounded-full border border-[--color-border] px-2.5 py-1 font-[--font-mono] text-[11px] text-[--color-text-faint]">
                {buildHash}
              </span>
              <span className="flex items-center gap-1.5 font-[--font-mono] text-[11px] text-[--color-accent]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-accent] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[--color-accent]" />
                </span>
                online
              </span>
              <span className="font-[--font-mono] text-[11px] text-[--color-text-faint]">
                {data ? `${data.profile.publicRepos} repos · synced live` : "loading"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="text-balance font-[--font-display] text-[length:--text-4xl] font-extrabold leading-[1.03] tracking-tight"
            >
              {data?.profile.name || siteConfig.siteName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-4 max-w-lg text-[length:--text-lg] text-[--color-text-muted]"
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
                className="glow-on-hover flex items-center gap-2 rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-semibold text-[--color-accent-contrast] transition-transform hover:scale-[1.02]"
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <SyncTerminal data={data} isLoading={isLoading} />
          </motion.div>
        </div>

        {/* Bento stats */}
        {data && (
          <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <BigStat
              icon={<Star size={16} />}
              label="Total stars"
              value={data.totalStars}
              className="col-span-2 row-span-1 lg:row-span-2"
            />
            <Stat
              icon={<Users size={14} />}
              label="Followers"
              value={data.profile.followers}
              className="col-span-2 lg:col-span-2"
            />
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
          <h2 className="font-[--font-display] text-[length:--text-2xl] font-bold tracking-tight">
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
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5 ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 text-[--color-text-faint]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-[--font-display] text-[length:--text-2xl] font-bold">{value}</p>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-[--radius-lg] border border-[--color-accent]/25 bg-gradient-to-br from-[--color-accent]/[0.06] to-transparent p-6 ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 text-[--color-accent]">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-4 font-[--font-display] text-[length:--text-4xl] font-extrabold leading-none lg:mt-0">
        {value}
      </p>
    </div>
  );
}
