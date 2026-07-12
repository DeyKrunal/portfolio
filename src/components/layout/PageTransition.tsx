import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * A framer-motion-based transition here would pull the ~130KB motion
 * vendor chunk into every route's critical path (RootLayout wraps every
 * page and isn't itself lazy-loaded) -- undoing the route-splitting work
 * from earlier phases. This does the same visual job with a plain CSS
 * transition instead, so the main bundle stays exactly as light as
 * before. prefers-reduced-motion is already handled globally in
 * styles/index.css, which zeroes out this transition too.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayKey, setDisplayKey] = useState(location.pathname);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (location.pathname === displayKey) return;
    setVisible(false);
    timeoutRef.current = window.setTimeout(() => {
      setDisplayKey(location.pathname);
      setVisible(true);
    }, 120);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div
      key={displayKey}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 180ms var(--ease-out-expo), transform 180ms var(--ease-out-expo)",
      }}
    >
      {children}
    </div>
  );
}
