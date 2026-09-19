"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadBlob } from "@/lib/generator/export";
import { generateDummyFile } from "@/lib/generator/dummy-file/generate";
import { DUMMY_FILE_FORMATS, getDummyFileFormatDef, type DummyFileFormat, type DummyFileGroup } from "@/lib/generator/dummy-file/types";

const SIZE_PRESETS: { label: string; bytes: number }[] = [
  { label: "1 KB", bytes: 1_000 },
  { label: "10 KB", bytes: 10_000 },
  { label: "100 KB", bytes: 100_000 },
  { label: "500 KB", bytes: 500_000 },
  { label: "1 MB", bytes: 1_000_000 },
  { label: "5 MB", bytes: 5_000_000 },
  { label: "10 MB", bytes: 10_000_000 },
  { label: "25 MB", bytes: 25_000_000 },
  { label: "50 MB", bytes: 50_000_000 },
];

const MAX_BYTES = 100_000_000; // 100 MB safety cap for in-browser generation
const GROUPS: DummyFileGroup[] = ["Text & Data", "Documents", "Images", "Binary"];

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function DummyFileGeneratorClient() {
  const [format, setFormat] = useState<DummyFileFormat>("txt");
  const [sizeValue, setSizeValue] = useState("1");
  const [sizeUnit, setSizeUnit] = useState<"KB" | "MB">("MB");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ requestedBytes: number; actualBytes: number; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const def = getDummyFileFormatDef(format);

  const targetBytes = useMemo(() => {
    const n = Number(sizeValue);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n * (sizeUnit === "MB" ? 1_000_000 : 1_000));
  }, [sizeValue, sizeUnit]);

  const belowMinimum = targetBytes > 0 && targetBytes < def.minBytes;
  const aboveMax = targetBytes > MAX_BYTES;
  const canGenerate = targetBytes > 0 && !belowMinimum && !aboveMax && !generating;

  function applyPreset(bytes: number) {
    if (bytes >= 1_000_000) {
      setSizeValue(String(bytes / 1_000_000));
      setSizeUnit("MB");
    } else {
      setSizeValue(String(bytes / 1_000));
      setSizeUnit("KB");
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const file = await generateDummyFile(format, targetBytes);
      // `Uint8Array` is always a valid BlobPart at runtime; the cast works around a strict
      // ArrayBufferLike-vs-ArrayBuffer generic mismatch in the current DOM lib typings.
      downloadBlob(file.bytes as BlobPart, file.filename, file.mimeType);
      setResult({ requestedBytes: file.requestedBytes, actualBytes: file.actualBytes, filename: file.filename });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate the file.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-1.5">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as DummyFileFormat)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUPS.map((group) => (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {DUMMY_FILE_FORMATS.filter((f) => f.group === group).map((f) => (
                      <SelectItem key={f.format} value={f.format}>
                        {f.label} (.{f.extension})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Quick sizes</Label>
            <div className="flex flex-wrap gap-1.5">
              {SIZE_PRESETS.map((p) => (
                <Button key={p.label} type="button" size="sm" variant="outline" onClick={() => applyPreset(p.bytes)}>
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dfg-size">Custom size</Label>
            <div className="flex gap-2">
              <Input
                id="dfg-size"
                type="number"
                min="0"
                step="any"
                value={sizeValue}
                onChange={(e) => setSizeValue(e.target.value)}
                className="w-32"
              />
              <Select value={sizeUnit} onValueChange={(v) => setSizeUnit(v as "KB" | "MB")}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KB">KB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {belowMinimum && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <TriangleAlert className="size-3.5" />A valid {def.label} needs at least {formatBytes(def.minBytes)}.
              </p>
            )}
            {aboveMax && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <TriangleAlert className="size-3.5" />
                Capped at {formatBytes(MAX_BYTES)} to keep in-browser generation reliable.
              </p>
            )}
            {!def.exactSize && !belowMinimum && !aboveMax && (
              <p className="text-xs text-muted-foreground">
                {def.label} files are padded to a very close match, not always byte-exact.
              </p>
            )}
          </div>

          <Button onClick={handleGenerate} disabled={!canGenerate} className="w-full sm:w-auto">
            {generating ? <Loader2 className="animate-spin" /> : <Download />}
            {generating ? "Generating…" : `Generate & Download ${targetBytes > 0 ? formatBytes(targetBytes) : ""} .${def.extension}`}
          </Button>

          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <TriangleAlert className="size-4" />
              {error}
            </p>
          )}

          {result && !error && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{result.filename}</p>
              <p className="text-muted-foreground">
                Requested {formatBytes(result.requestedBytes)} — actual file is{" "}
                {formatBytes(result.actualBytes)}
                {result.actualBytes === result.requestedBytes ? " (exact match)" : ""}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>
          Every format produces a genuinely valid, openable file (a real image, a real PDF/DOCX/XLSX,
          a real archive) padded with harmless filler data to reach your target size — not just
          random bytes with a renamed extension. Use these to test upload size limits, format
          validation, and large-file handling.
        </p>
      </div>
    </div>
  );
}
