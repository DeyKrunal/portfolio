import { useEffect, useState } from "react";
import type { GithubDataSnapshot } from "@/types/github";

interface SyncTerminalProps {
  data: GithubDataSnapshot | undefined;
  isLoading: boolean;
}

interface Line {
  text: string;
  color?: "text" | "muted" | "accent" | "gold";
}

function buildLines(data: GithubDataSnapshot | undefined): Line[] {
  if (!data) {
    return [
      { text: "$ git clone github.com/DeyKrunal", color: "text" },
      { text: "Cloning...", color: "muted" },
    ];
  }
  return [
    { text: "$ git log --sync --since=6h", color: "text" },
    { text: `synced ${data.profile.publicRepos} repositories`, color: "accent" },
    { text: `${data.totalStars} stars · ${data.profile.followers} followers`, color: "gold" },
    { text: `streak: ${data.currentStreak}d (longest ${data.longestStreak}d)`, color: "muted" },
    { text: "✓ up to date", color: "accent" },
  ];
}

/**
 * Types out each line character-by-character, one line at a time, then
 * leaves a blinking cursor on the last line. Respects prefers-reduced-motion
 * by rendering all lines immediately instead of animating the typing.
 */
export function SyncTerminal({ data, isLoading }: SyncTerminalProps) {
  const lines = buildLines(data);
  const [visibleLines, setVisibleLines] = useState(0);
  const [charsTyped, setCharsTyped] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
  }, []);

  useEffect(() => {
    setVisibleLines(0);
    setCharsTyped(0);
  }, [data]);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(lines.length);
      return;
    }
    if (visibleLines >= lines.length) return;

    const currentLine = lines[visibleLines];
    if (charsTyped < currentLine.text.length) {
      const timeout = setTimeout(() => setCharsTyped((c) => c + 1), 18);
      return () => clearTimeout(timeout);
    }
    const lineDelay = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCharsTyped(0);
    }, 220);
    return () => clearTimeout(lineDelay);
  }, [charsTyped, visibleLines, lines, reducedMotion]);

  const colorClass: Record<NonNullable<Line["color"]>, string> = {
    text: "text-[--color-text]",
    muted: "text-[--color-text-faint]",
    accent: "text-[--color-accent]",
    gold: "text-[--color-accent-alt]",
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-[--radius-lg] border border-[--color-border] bg-[#0D111A] shadow-[--shadow-lg]">
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/20 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[--color-accent-warn]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[--color-accent-alt]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[--color-accent]" />
        <span className="ml-2 font-[--font-mono] text-[11px] text-white/30">
          sync.sh — DeyKrunal
        </span>
      </div>
      <div className="min-h-[168px] px-4 py-4 font-[--font-mono] text-[13px] leading-relaxed">
        {isLoading && !data && (
          <p className="text-white/40">Connecting to GitHub Actions...</p>
        )}
        {lines.slice(0, visibleLines + 1).map((line, i) => {
          const isCurrent = i === visibleLines && !reducedMotion;
          const displayText = isCurrent ? line.text.slice(0, charsTyped) : line.text;
          return (
            <p key={i} className={colorClass[line.color ?? "text"]}>
              {displayText}
              {isCurrent && (
                <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse bg-[--color-accent] align-middle" />
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
