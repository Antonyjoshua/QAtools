export default function FramesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          A single iframe. Switch into its frame context to interact with the form inside.
        </p>
        <iframe
          src="/playground/frame-inner"
          title="Single frame"
          data-testid="single-frame"
          className="h-56 w-full rounded-md border border-border"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          A nested frame — a frame inside a frame. Practice drilling down two levels.
        </p>
        <iframe
          src="/playground/frame-outer"
          title="Nested frame"
          data-testid="nested-outer-frame"
          className="h-96 w-full rounded-md border border-border"
        />
      </div>
    </div>
  );
}
