export default function HoverPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The menu below only appears on a real hover — a plain click without hovering first won&apos;t
        reveal it. In Playwright use <code className="rounded bg-muted px-1">locator.hover()</code>;
        in Selenium use <code className="rounded bg-muted px-1">Actions.moveToElement()</code>.
      </p>
      <div className="group relative inline-block">
        <button
          type="button"
          data-testid="hover-trigger"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium"
        >
          Hover over me
        </button>
        <div
          data-testid="hover-menu"
          className="invisible absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-popover p-1 opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              data-testid={`hover-menu-item-${n}`}
              className="rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              Menu Item {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
