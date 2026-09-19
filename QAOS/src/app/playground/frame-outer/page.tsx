export default function FrameOuterPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <h2 data-testid="frame-outer-heading" className="mb-3 text-lg font-semibold">
        Outer Frame
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        This frame itself contains another frame — the innermost form is one level deeper.
      </p>
      <iframe
        src="/playground/frame-inner"
        title="Inner frame"
        data-testid="nested-inner-frame"
        className="h-64 w-full rounded-md border border-border"
      />
    </div>
  );
}
