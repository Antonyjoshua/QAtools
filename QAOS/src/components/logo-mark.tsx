/**
 * The QuanGrade mark: two incomplete concentric rings plus a breakaway tick —
 * an orbit/signal motif for a platform that's always reading and grading live
 * system data. The gap in the outer ring is where the mark's "Q" lives.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="quangrade-mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E6FFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="15" fill="none" stroke="url(#quangrade-mark-grad)" strokeWidth="3.4" strokeDasharray="62 32" strokeLinecap="round" />
      <circle
        cx="24"
        cy="24"
        r="9.5"
        fill="none"
        stroke="url(#quangrade-mark-grad)"
        strokeWidth="2.8"
        strokeDasharray="35 25"
        strokeLinecap="round"
        opacity="0.55"
        transform="rotate(150 24 24)"
      />
      <path d="M35 33 L41 39" stroke="url(#quangrade-mark-grad)" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}
