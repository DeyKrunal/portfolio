import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Layers,
  Award,
  Trophy,
  Image as ImageIcon,
  MessageSquareQuote,
  Notebook,
  Settings as SettingsIcon,
  FolderOpen,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/features/admin/hooks/useAuth";
import { cn } from "@/lib/cn";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/experience", label: "Experience", icon: Briefcase },
      { to: "/admin/education", label: "Education", icon: GraduationCap },
      { to: "/admin/skills", label: "Skills", icon: Layers },
      { to: "/admin/certificates", label: "Certificates", icon: Award },
      { to: "/admin/achievements", label: "Achievements", icon: Trophy },
      { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/admin/blog", label: "Blog", icon: Notebook },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/media", label: "Media Library", icon: FolderOpen },
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export function AdminLayout() {
  const { user, signOutUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-[--color-bg]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[--color-border] bg-[--color-surface] md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-[--color-border] px-5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-accent-alt] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[--color-accent-alt]" />
          </span>
          <span className="font-[--font-display] text-sm font-semibold">Admin</span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[--color-text-faint]">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={"end" in item ? item.end : false}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[--color-text-muted] transition-colors hover:bg-[--color-bg-subtle] hover:text-[--color-text]",
                        isActive && "bg-[--color-accent]/10 text-[--color-accent]"
                      )
                    }
                  >
                    <item.icon size={16} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[--color-border] p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[--color-text-muted] hover:bg-[--color-bg-subtle] hover:text-[--color-text]"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            type="button"
            onClick={signOutUser}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-[--color-text-muted] hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[--color-border] bg-[--color-surface] px-5 md:px-8">
          <p className="text-sm text-[--color-text-muted] md:hidden">Admin</p>
          <div className="ml-auto flex items-center gap-3">
            {user?.photoURL && (
              <img src={user.photoURL} alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
            )}
            <span className="hidden text-sm text-[--color-text-muted] sm:inline">{user?.email}</span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
