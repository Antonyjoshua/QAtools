import { DbProvider } from "@/components/testcases/shared/db-provider";

export default function TestManagementLayout({ children }: { children: React.ReactNode }) {
  return <DbProvider>{children}</DbProvider>;
}
