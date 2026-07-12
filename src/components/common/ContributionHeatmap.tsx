import { useMemo } from "react";
import type { ContributionDay } from "@/types/github";

const LEVEL_COLORS = [
  "rgb(var(--color-bg-subtle))",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

export function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
  const weeks = useMemo(() => {
    const result: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    days.forEach((day, i) => {
      const dow = new Date(day.date).getDay();
      if (i === 0) {
        for (let j = 0; j < dow; j++) {
          currentWeek.push({ date: "", count: 0, level: 0 });
        }
      }
      currentWeek.push(day);
      if (dow === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length) result.push(currentWeek);
    return result;
  }, [days]);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1" style={{ minWidth: weeks.length * 13 }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date ? `${day.date}: ${day.count} contributions` : undefined}
                className="h-[11px] w-[11px] rounded-sm"
                style={{ backgroundColor: day.date ? LEVEL_COLORS[day.level] : "transparent" }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-[--color-text-faint]">
        Less
        {LEVEL_COLORS.map((c, i) => (
          <span key={i} className="h-[11px] w-[11px] rounded-sm" style={{ backgroundColor: c }} />
        ))}
        More
      </div>
    </div>
  );
}
