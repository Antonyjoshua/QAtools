import { DbProvider } from "@/components/jobs/db-provider";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <DbProvider>{children}</DbProvider>;
}
