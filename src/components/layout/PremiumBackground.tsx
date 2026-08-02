/**
 * Mounted once in App.tsx, fixed behind all page content. The grid +
 * vignette come from the .premium-bg utility's ::before/::after in
 * index.css; this component only supplies the blurred glow blobs.
 */
export function PremiumBackground() {
  return (
    <div className="premium-bg" aria-hidden="true">
      <span
        className="premium-blob"
        style={{
          top: "-8%",
          left: "-6%",
          width: "42vw",
          height: "42vw",
          maxWidth: 560,
          maxHeight: 560,
          background: "radial-gradient(circle, rgb(var(--color-accent-from)), transparent 70%)",
        }}
      />
      <span
        className="premium-blob"
        style={{
          top: "6%",
          right: "-10%",
          width: "38vw",
          height: "38vw",
          maxWidth: 520,
          maxHeight: 520,
          background: "radial-gradient(circle, rgb(var(--color-accent-to)), transparent 70%)",
          animationDelay: "-9s",
        }}
      />
      <span
        className="premium-blob"
        style={{
          bottom: "-12%",
          left: "20%",
          width: "34vw",
          height: "34vw",
          maxWidth: 460,
          maxHeight: 460,
          background: "radial-gradient(circle, rgb(var(--color-cyan)), transparent 70%)",
          animationDelay: "-15s",
          opacity: 0.14,
        }}
      />
    </div>
  );
}
