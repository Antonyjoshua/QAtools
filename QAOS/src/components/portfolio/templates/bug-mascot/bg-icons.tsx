const ICONS = [
  { top: "6%", left: "4%", d: "M9 6.5L7 4.5M15 6.5L17 4.5M5 10H3M21 10H19M8 14L5 17M16 14L19 17", extra: "circle" as const },
  { top: "14%", left: "88%", d: "M4 13l5 5L20 7" },
  { top: "28%", left: "7%", d: "M4 6l6 6-6 6M12 18h8" },
  { top: "42%", left: "3%", d: "M5 3l14 9-14 9V3z" },
  { top: "38%", left: "92%", d: "M8 6L4 12l4 6M16 6l4 6-4 6" },
  { top: "62%", left: "5%", d: "M9 6.5L7 4.5M15 6.5L17 4.5M5 10H3M21 10H19M8 14L5 17M16 14L19 17", extra: "circle" as const },
  { top: "72%", left: "91%", d: "M18 6L6 18M6 6l12 12" },
  { top: "80%", left: "6%", d: "M4 13l5 5L20 7" },
];

export function BgIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {ICONS.map((icon, i) => (
        <svg
          key={i}
          className="bg-icon"
          style={{ top: icon.top, left: icon.left, animationDuration: `${9 + (i % 3) * 2}s`, animationDelay: `-${i * 1.3}s` }}
          viewBox="0 0 24 24"
        >
          {icon.extra === "circle" && <circle cx="12" cy="10" r="4" />}
          <path d={icon.d} />
        </svg>
      ))}
    </div>
  );
}
