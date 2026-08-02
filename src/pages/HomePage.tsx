import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, GitBranch, Flame, MapPin, Sparkles, Download } from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { RepoCard } from "@/components/common/RepoCard";
import { RepoCardSkeleton } from "@/components/common/RepoCardSkeleton";
import { SyncTerminal } from "@/components/common/SyncTerminal";
import { ParticleField } from "@/components/common/ParticleField";
import { SpotlightContainer } from "@/components/layout/SpotlightContainer";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCountUp } from "@/hooks/useCountUp";
import { useRotatingText } from "@/hooks/useRotatingText";
import { siteConfig } from "@/config/site";
import { useSeo } from "@/hooks/useSeo";
import type { ResumeSettings } from "@/types/content";

const ROLES = [
  "Software Developer",
  "Software Architect",
  "UI/UX Designer",
  "Full Stack Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Freelancer",
  "Technical Consultant",
];

export function HomePage() {
  useSeo({ title: "", path: "/" });
  const { data, isLoading, error } = useGithubSnapshot();
  const { data: resume } = useFirestoreDoc<ResumeSettings>("settings", "resume");
  const social = useSocialLinks();
  const workCtaRef = useMagnetic<HTMLAnchorElement>();
  const role = useRotatingText(ROLES);
  const pinned = data?.repositories.filter((r) => r.isPinned).slice(0, 6);

  const yearsExperience = data
    ? Math.max(1, new Date().getFullYear() - new Date(data.profile.createdAt).getFullYear())
    : null;

  return (
    <>
      {/* Hero */}
      <SpotlightContainer>
        <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <ParticleField />

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[--color-border] bg-[--card-bg] px-3.5 py-1.5"
              >
                <Sparkles size={13} className="text-[--color-accent-from]" />
                <span className="text-xs font-medium text-[--color-text-muted]">
                  Available for new opportunities
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="text-balance font-[--font-display] text-[length:--text-4xl] font-bold leading-[1.02] tracking-tight"
              >
                Hi, I'm{" "}
                <span className="text-gradient">
                  {data?.profile.name?.split(" ")[0] || siteConfig.siteName.split(" ")[0]}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="mt-2 h-8 font-[--font-display] text-xl font-semibold text-[--color-text-muted] sm:text-2xl"
              >
                <span
                  style={{
                    opacity: role.visible ? 1 : 0,
                    transition: "opacity 220ms var(--ease-out-expo)",
                  }}
                >
                  {role.current}
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                className="mt-5 max-w-lg text-[length:--text-lg] leading-[1.7] text-[--color-text-muted]"
              >
                {data?.profile.bio || siteConfig.siteDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[--color-text-faint]"
              >
                {data?.profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {data.profile.location}
                  </span>
                )}
                {yearsExperience && (
                  <span className="flex items-center gap-1.5">
                    <GitBranch size={14} /> {yearsExperience}+ years on GitHub
                  </span>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/contact"
                  className="btn-primary flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Hire Me <ArrowRight size={15} />
                </Link>
                {resume?.resumeUrl && (
                  <a
                    href={resume.resumeUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    <Download size={15} /> Download Resume
                  </a>
                )}
                <Link
                  ref={workCtaRef}
                  to="/projects"
                  className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
                >
                  View Projects
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.34 }}
                className="mt-8 flex items-center gap-4"
              >
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-[--color-text-faint] transition-colors hover:text-[--color-text]"
                >
                  <GithubIcon width={18} height={18} />
                </a>
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="text-[--color-text-faint] transition-colors hover:text-[--color-text]"
                  >
                    <LinkedinIcon width={18} height={18} />
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                    className="text-[--color-text-faint] transition-colors hover:text-[--color-text]"
                  >
                    <XIcon width={18} height={18} />
                  </a>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {data?.profile.avatarUrl && (
                <div className="float-card relative mb-6 hidden sm:block lg:absolute lg:-top-6 lg:right-8 lg:mb-0">
                  <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-[--color-accent-from] to-[--color-accent-to] opacity-40 blur-2xl" />
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.name ?? "Profile photo"}
                    width={88}
                    height={88}
                    className="h-[88px] w-[88px] rounded-full border-2 border-[--color-border] object-cover shadow-[--shadow-lg]"
                  />
                </div>
              )}

              <div className="float-card mt-4 lg:mt-16">
                <SyncTerminal data={data} isLoading={isLoading} />
              </div>

              {data && data.topLanguages.length > 0 && (
                <div
                  className="glass float-card absolute -bottom-6 -left-4 hidden w-48 rounded-2xl p-3.5 shadow-[--shadow-lg] sm:block"
                  style={{ animationDelay: "-2s" }}
                >
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[--color-text-faint]">
                    Top languages
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.topLanguages.slice(0, 4).map((lang) => (
                      <span
                        key={lang.name}
                        className="rounded-full border border-[--color-border] px-2 py-0.5 text-[11px] font-medium"
                        style={{ color: lang.color ?? undefined }}
                      >
                        {lang.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Stats */}
          {data && (
            <div className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <HeroStat icon={<Star size={15} />} label="Total stars" value={data.totalStars} />
              <HeroStat icon={<Users size={15} />} label="Followers" value={data.profile.followers} />
              <HeroStat icon={<GitBranch size={15} />} label="Repositories" value={data.profile.publicRepos} />
              <HeroStat icon={<Flame size={15} />} label="Day streak" value={data.currentStreak} />
            </div>
          )}

          {error != null && (
            <p className="mt-10 rounded-[--radius-md] border border-[--color-error]/30 bg-[--color-error]/5 px-4 py-3 text-sm text-[--color-error]">
              GitHub data hasn't synced yet. Run <code>npm run fetch:github</code> locally or wait
              for the "Sync GitHub Data" Action to complete.
            </p>
          )}
        </section>
      </SpotlightContainer>

      {/* Pinned projects */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[--color-accent-from]">
              Selected work
            </p>
            <h2 className="font-[--font-display] text-[length:--text-2xl] font-bold tracking-tight">
              Pinned projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-[--color-text-muted] hover:text-[--color-text]"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} />)}
          {pinned?.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} featured={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  const animated = useCountUp(value);
  return (
    <div className="card-premium p-5">
      <div className="flex items-center gap-1.5 text-[--color-text-faint]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-[--font-display] text-[length:--text-2xl] font-bold">
        {animated.toLocaleString()}
      </p>
    </div>
  );
}
