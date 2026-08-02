import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPaletteTrigger } from "@/components/common/CommandPaletteTrigger";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.2, 6);

  return (
    <div className="sticky top-3 z-50 px-3 sm:top-4 sm:px-4">
      <header className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full px-4 shadow-[--shadow-md] sm:px-5">
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
                  "nav-underline rounded-full px-3 py-1.5 text-sm text-[--color-text-muted] transition-colors duration-150 hover:text-[--color-text]",
                  isActive && "text-[--color-text]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <CommandPaletteTrigger />
          <ThemeToggle />
          <NavLink
            ref={ctaRef}
            to="/contact"
            className="btn-primary rounded-full px-4 py-2 text-xs font-semibold"
          >
            Let's talk
          </NavLink>
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
      </header>

      {open && (
        <nav
          className="glass mx-auto mt-2 max-w-5xl rounded-3xl px-4 py-3 md:hidden"
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
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-1 rounded-full px-3 py-2 text-center text-sm font-semibold"
            >
              Let's talk
            </NavLink>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <CommandPaletteTrigger />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </div>
  );
}

/**
 * Signature element: a small live "build status" light next to the
 * wordmark -- a quiet nod to the fact that this whole site is a running
 * pipeline (GitHub Action -> JSON -> static build), not a one-time
 * template. Restrained: one signature here, nothing else in the navbar moves.
 */
function StatusDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-accent-from] opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-[--color-accent-from] to-[--color-accent-to]" />
    </span>
  );
}
