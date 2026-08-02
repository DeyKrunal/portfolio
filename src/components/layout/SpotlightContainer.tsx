import { useRef, type ReactNode } from "react";

export function SpotlightContainer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{
        backgroundImage:
          "radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(var(--color-accent-from) / 0.06), transparent 70%)",
      }}
    >
      {children}
    </div>
  );
}
