"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/solo/ui/tabs";
import { ThemeGallery } from "./components/theme-gallery";
import { TitlesGallery } from "./components/titles-gallery";
import { CertificatesGallery } from "./components/certificates-gallery";

export function InventoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Themes, titles, and certificates you&apos;ve earned.</p>
      </div>
      <Tabs defaultValue="themes">
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="themes">
          <ThemeGallery />
        </TabsContent>
        <TabsContent value="titles">
          <TitlesGallery />
        </TabsContent>
        <TabsContent value="certificates">
          <CertificatesGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}
