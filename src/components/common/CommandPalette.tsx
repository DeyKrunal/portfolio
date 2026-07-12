import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import {
  Search,
  FileText,
  Folder,
  Notebook,
  Layers,
  Award,
  MessageSquareQuote,
} from "lucide-react";
import { useGithubSnapshot } from "@/hooks/useGithub";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { BlogPostEntry, SkillEntry, CertificateEntry, TestimonialEntry } from "@/types/content";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: "Page" | "Project" | "Blog" | "Skill" | "Certificate" | "Testimonial";
  icon: React.ComponentType<{ size?: number }>;
}

const STATIC_PAGES: SearchResult[] = [
  { id: "home", title: "Home", href: "/", category: "Page", icon: FileText },
  { id: "projects", title: "Projects", href: "/projects", category: "Page", icon: FileText },
  { id: "about", title: "About", href: "/about", category: "Page", icon: FileText },
  { id: "experience", title: "Experience", href: "/experience", category: "Page", icon: FileText },
  { id: "education", title: "Education", href: "/education", category: "Page", icon: FileText },
  { id: "skills", title: "Skills", href: "/skills", category: "Page", icon: FileText },
  { id: "certificates", title: "Certificates", href: "/certificates", category: "Page", icon: FileText },
  { id: "achievements", title: "Achievements", href: "/achievements", category: "Page", icon: FileText },
  { id: "gallery", title: "Gallery", href: "/gallery", category: "Page", icon: FileText },
  { id: "testimonials", title: "Testimonials", href: "/testimonials", category: "Page", icon: FileText },
  { id: "resume", title: "Resume", href: "/resume", category: "Page", icon: FileText },
  { id: "analytics", title: "GitHub Analytics", href: "/analytics", category: "Page", icon: FileText },
  { id: "blog", title: "Blog", href: "/blog", category: "Page", icon: FileText },
  { id: "contact", title: "Contact", href: "/contact", category: "Page", icon: FileText },
];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: github } = useGithubSnapshot();
  const { data: posts } = useFirestoreCollection<BlogPostEntry>("blogPosts", "order");
  const { data: skills } = useFirestoreCollection<SkillEntry>("skills", "order");
  const { data: certificates } = useFirestoreCollection<CertificateEntry>("certificates", "order");
  const { data: testimonials } = useFirestoreCollection<TestimonialEntry>("testimonials", "order");

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const allResults: SearchResult[] = useMemo(() => {
    const projects: SearchResult[] = (github?.repositories ?? [])
      .filter((r) => !r.isFork && !r.isArchived)
      .map((r) => ({
        id: `project-${r.id}`,
        title: r.name,
        subtitle: r.description ?? undefined,
        href: `/projects/${r.name}`,
        category: "Project" as const,
        icon: Folder,
      }));

    const blogResults: SearchResult[] = (posts ?? [])
      .filter((p) => p.status === "published")
      .map((p) => ({
        id: `blog-${p.id}`,
        title: p.title,
        subtitle: p.excerpt,
        href: `/blog/${p.slug}`,
        category: "Blog" as const,
        icon: Notebook,
      }));

    const skillResults: SearchResult[] = (skills ?? []).map((s) => ({
      id: `skill-${s.id}`,
      title: s.name,
      subtitle: s.category,
      href: "/skills",
      category: "Skill" as const,
      icon: Layers,
    }));

    const certResults: SearchResult[] = (certificates ?? []).map((c) => ({
      id: `cert-${c.id}`,
      title: c.title,
      subtitle: c.organization,
      href: "/certificates",
      category: "Certificate" as const,
      icon: Award,
    }));

    const testimonialResults: SearchResult[] = (testimonials ?? []).map((t) => ({
      id: `testimonial-${t.id}`,
      title: t.authorName,
      subtitle: t.quote.slice(0, 60),
      href: "/testimonials",
      category: "Testimonial" as const,
      icon: MessageSquareQuote,
    }));

    return [
      ...STATIC_PAGES,
      ...projects,
      ...blogResults,
      ...skillResults,
      ...certResults,
      ...testimonialResults,
    ];
  }, [github, posts, skills, certificates, testimonials]);

  const fuse = useMemo(
    () => new Fuse(allResults, { keys: ["title", "subtitle", "category"], threshold: 0.35 }),
    [allResults]
  );

  const results = useMemo(() => {
    if (!query.trim()) {
      return STATIC_PAGES.concat(
        allResults.slice(STATIC_PAGES.length, STATIC_PAGES.length + 6)
      );
    }
    return fuse
      .search(query)
      .map((r) => r.item)
      .slice(0, 20);
  }, [query, fuse, allResults]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function select(result: SearchResult) {
    navigate(result.href);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) select(results[activeIndex]);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] shadow-[--shadow-lg]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[--color-border] px-4 py-3">
          <Search size={16} className="text-[--color-text-faint]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, blog, skills..."
            aria-label="Search"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="rounded border border-[--color-border] px-1.5 py-0.5 font-[--font-mono] text-[10px] text-[--color-text-faint]">
            Esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[--color-text-muted]">
              No results for "{query}"
            </p>
          )}
          {results.map((result, i) => (
            <button
              key={result.id}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => select(result)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                i === activeIndex ? "bg-[--color-bg-subtle]" : ""
              }`}
            >
              <result.icon size={15} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{result.title}</p>
                {result.subtitle && (
                  <p className="truncate text-xs text-[--color-text-faint]">{result.subtitle}</p>
                )}
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-[--color-text-faint]">
                {result.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
