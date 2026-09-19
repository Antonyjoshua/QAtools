"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BugToggleTable } from "@/components/playground/admin/bug-toggle-table";
import { ChallengeCatalogTable } from "@/components/playground/admin/challenge-catalog-table";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">⚙️ Admin</h1>
        <p className="text-sm text-muted-foreground">
          Toggle injected bugs on/off and review the full challenge catalog.
        </p>
      </div>
      <Tabs defaultValue="bugs">
        <TabsList>
          <TabsTrigger value="bugs">Bug Injection</TabsTrigger>
          <TabsTrigger value="catalog">Challenge Catalog</TabsTrigger>
        </TabsList>
        <TabsContent value="bugs" className="mt-4">
          <BugToggleTable />
        </TabsContent>
        <TabsContent value="catalog" className="mt-4">
          <ChallengeCatalogTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
