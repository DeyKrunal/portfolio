import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Layers,
  Award,
  Trophy,
  Image as ImageIcon,
  MessageSquareQuote,
  Notebook,
} from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useGithubSnapshot } from "@/hooks/useGithub";

const COUNTERS = [
  { label: "Experience", collection: "experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", collection: "education", href: "/admin/education", icon: GraduationCap },
  { label: "Skills", collection: "skills", href: "/admin/skills", icon: Layers },
  { label: "Certificates", collection: "certificates", href: "/admin/certificates", icon: Award },
  { label: "Achievements", collection: "achievements", href: "/admin/achievements", icon: Trophy },
  { label: "Gallery", collection: "gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Testimonials", collection: "testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Blog posts", collection: "blogPosts", href: "/admin/blog", icon: Notebook },
];

export function AdminOverviewPage() {
  const { data: github } = useGithubSnapshot();

  return (
    <div>
      <h1 className="font-[--font-display] text-xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-[--color-text-muted]">
        A quick look at everything that feeds the public site.
      </p>

      <div className="mt-6 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[--color-text-faint]">
          GitHub sync
        </p>
        {github ? (
          <div className="mt-2 flex flex-wrap items-center gap-6">
            <Stat label="Public repos" value={github.profile.publicRepos} />
            <Stat label="Total stars" value={github.totalStars} />
            <Stat label="Followers" value={github.profile.followers} />
            <Stat label="Current streak" value={`${github.currentStreak}d`} />
            <span className="ml-auto text-xs text-[--color-text-faint]">
              Last synced{" "}
              {new Date(github.generatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[--color-text-muted]">
            No snapshot yet — run <code>npm run fetch:github</code> or wait for the sync Action.
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {COUNTERS.map((c) => (
          <CounterCard key={c.collection} {...c} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-[--color-text-faint]">{label}</p>
      <p className="font-[--font-display] text-lg font-semibold">{value}</p>
    </div>
  );
}

function CounterCard({
  label,
  collection,
  href,
  icon: Icon,
}: {
  label: string;
  collection: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const { data, isLoading } = useFirestoreCollection<{ id: string }>(collection, "order");

  return (
    <Link
      to={href}
      className="flex flex-col gap-2 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] p-4 transition-colors hover:border-[--color-border-strong]"
    >
      <Icon size={16} className="text-[--color-accent]" />
      <p className="font-[--font-display] text-xl font-semibold">
        {isLoading ? "—" : (data?.length ?? 0)}
      </p>
      <p className="text-xs text-[--color-text-muted]">{label}</p>
    </Link>
  );
}
