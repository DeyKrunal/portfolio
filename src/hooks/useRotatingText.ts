import { useEffect, useState } from "react";

export function useRotatingText(items: string[], intervalMs = 2400) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || items.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      const fadeOut = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 220);
      return () => clearTimeout(fadeOut);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [items, intervalMs]);

  return { current: items[index] ?? items[0], visible };
}
