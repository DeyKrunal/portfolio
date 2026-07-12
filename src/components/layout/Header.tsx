import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPaletteTrigger } from "@/components/common/CommandPaletteTrigger";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-[--font-display] text-sm font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <StatusDot />
          {siteConfig.siteName}
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-1.5 text-sm text-[--color-text-muted] transition-colors duration-150 hover:text-[--color-text]",
                  isActive && "bg-[--color-bg-subtle] text-[--color-text]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CommandPaletteTrigger />
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[--color-text] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-[--color-border] px-4 py-3 md:hidden"
          aria-label="Primary mobile"
        >
          <div className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm text-[--color-text-muted]",
                    isActive && "bg-[--color-bg-subtle] text-[--color-text]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <CommandPaletteTrigger />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}

/**
 * Signature element: a small live "build status" light next to the
 * wordmark. It pulses green — a quiet nod to the fact that this whole
 * site is a running pipeline (GitHub Action -> JSON -> static build),
 * not a one-time template. Restrained: one signature, nothing else moves.
 */
function StatusDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-accent-alt] opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[--color-accent-alt] signal-dot" />
    </span>
  );
}
