import { useEffect, useRef } from "react";

/**
 * Returns a ref to attach to a button/link. While the cursor is over the
 * element, it translates a few pixels toward the cursor position; on
 * leave, it springs back to rest. Disabled entirely on touch/coarse
 * pointer devices and when prefers-reduced-motion is set.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25, maxOffset = 10) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsHover || reducedMotion) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-maxOffset, Math.min(maxOffset, relX * strength));
      const y = Math.max(-maxOffset, Math.min(maxOffset, relY * strength));
      el!.style.transform = `translate(${x}px, ${y}px)`;
    }

    function handleMouseLeave() {
      el!.style.transform = "translate(0, 0)";
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, maxOffset]);

  return ref;
}
