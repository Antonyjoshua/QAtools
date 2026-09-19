"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function handleUpload() {
    if (!selectedFile) {
      setResult("No file selected.");
      return;
    }
    setResult(`Uploaded: ${selectedFile.name} (${selectedFile.size} bytes)`);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        A real <code className="rounded bg-muted px-1">&lt;input type=&quot;file&quot;&gt;</code>.
        Nothing is sent to a server — the file&apos;s name and size are read locally and reported
        back below.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="file"
          data-testid="file-input"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <Button data-testid="upload-button" onClick={handleUpload}>
          Upload
        </Button>
      </div>
      {result && (
        <p data-testid="upload-result" className="text-sm text-muted-foreground">
          {result}
        </p>
      )}
    </div>
  );
}
