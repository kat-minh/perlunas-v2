/** Fixed, full-viewport paper grain. Pure CSS, server-rendered. */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="paper-grain pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
