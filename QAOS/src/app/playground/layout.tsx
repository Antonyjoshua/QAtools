// Matches QAOS's own module convention: a thin layout providing shared chrome/padding, with each
// page/sub-layout handling its own max-width centering.
export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 md:p-6">{children}</div>;
}
