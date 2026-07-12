import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { value: "light" as const, icon: Sun, label: "Light theme" },
  { value: "dark" as const, icon: Moon, label: "Dark theme" },
  { value: "system" as const, icon: Monitor, label: "System theme" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-full border border-[--color-border] bg-[--color-surface] p-0.5"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150",
            theme === value
              ? "bg-[--color-accent] text-[--color-accent-contrast]"
              : "text-[--color-text-faint] hover:text-[--color-text]"
          )}
        >
          <Icon size={14} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
