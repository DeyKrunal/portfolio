import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-[--radius-lg] border border-dashed border-[--color-border] px-6 py-16 text-center">
      <Icon size={28} className="text-[--color-text-faint]" />
      <p className="mt-4 font-[--font-display] text-base font-semibold">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-[--color-text-muted]">{description}</p>
    </div>
  );
}
