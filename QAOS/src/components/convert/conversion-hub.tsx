"use client";

import * as React from "react";
import { ArrowRight, Star, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "./upload-zone";
import { DetectedFileCard } from "./detected-file-card";
import { FormatPicker } from "./format-picker";
import { ConversionOptionsPanel } from "./conversion-options-panel";
import { JobRow, type ConversionJobState } from "./job-row";
import { detectFile, type DetectedFile } from "@/lib/convert/services/format-detection";
import { runConversion } from "@/lib/convert/services/conversion-service";
import { getFormat } from "@/lib/convert/core/format-registry";
import { getConversionAvailability } from "@/lib/convert/core/engine";
import { useConvertSettings } from "@/lib/convert/settings-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function uid(): string {
  return crypto.randomUUID();
}

export function ConversionHub({ initialFormatPair }: { initialFormatPair?: { from: string; to: string } }) {
  const [detectedFiles, setDetectedFiles] = React.useState<DetectedFile[]>([]);
  const [outputFormat, setOutputFormat] = React.useState<string | null>(null);
  const [options, setOptions] = React.useState<Record<string, unknown>>({});
  const [jobs, setJobs] = React.useState<ConversionJobState[] | null>(null);
  const [converting, setConverting] = React.useState(false);

  const isFavoritePair = useConvertSettings((s) => s.isFavoritePair);
  const toggleFavoritePair = useConvertSettings((s) => s.toggleFavoritePair);

  const inputFormat = detectedFiles[0]?.format?.id;
  const inputFormatDef = inputFormat ? getFormat(inputFormat) : undefined;

  function handleFilesSelected(files: File[]) {
    const detected = files.map(detectFile);
    const first = detected[0]?.format?.id;
    const kept = detected.filter((d) => d.format?.id === first);
    const skipped = detected.length - kept.length;
    if (skipped > 0) toast.warning(`${skipped} file${skipped === 1 ? "" : "s"} skipped — they don't match the format of the first file.`);
    setDetectedFiles(kept);
    setJobs(null);
    setOptions({});

    if (first && initialFormatPair && initialFormatPair.from === first && getConversionAvailability(initialFormatPair.from, initialFormatPair.to).supported) {
      setOutputFormat(initialFormatPair.to);
    } else {
      setOutputFormat(null);
    }
  }

  function removeFile(index: number) {
    setDetectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleConvert() {
    if (!inputFormat || !outputFormat || detectedFiles.length === 0) return;
    setConverting(true);
    const initialJobs: ConversionJobState[] = detectedFiles.map((d) => ({ id: uid(), file: d.file, progress: null, result: null }));
    setJobs(initialJobs);

    const operation = (options as { operation?: string }).operation;
    const isMultiFileJob = outputFormat === "zip" || (inputFormat === "pdf" && outputFormat === "pdf" && operation === "merge");

    if (isMultiFileJob) {
      const { result } = await runConversion({
        files: detectedFiles.map((d) => d.file),
        inputFormat,
        outputFormat,
        options,
        onProgress: (progress) => setJobs((prev) => (prev ? prev.map((j) => ({ ...j, progress })) : prev)),
      });
      setJobs([{ id: uid(), file: detectedFiles[0].file, progress: null, result }]);
    } else {
      for (let i = 0; i < detectedFiles.length; i++) {
        const jobId = initialJobs[i].id;
        const { result } = await runConversion({
          files: [detectedFiles[i].file],
          inputFormat,
          outputFormat,
          options,
          onProgress: (progress) => setJobs((prev) => (prev ? prev.map((j) => (j.id === jobId ? { ...j, progress } : j)) : prev)),
        });
        setJobs((prev) => (prev ? prev.map((j) => (j.id === jobId ? { ...j, result } : j)) : prev));
      }
    }
    setConverting(false);
  }

  function handleReset() {
    setDetectedFiles([]);
    setOutputFormat(null);
    setOptions({});
    setJobs(null);
  }

  if (jobs !== null) {
    const allDone = jobs.every((j) => j.result !== null);
    const successCount = jobs.filter((j) => j.result?.success).length;
    return (
      <div className="flex flex-col gap-4">
        {allDone && (
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-medium">
              {successCount} of {jobs.length} conversion{jobs.length === 1 ? "" : "s"} completed
            </p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleReset}>
              <RotateCcw className="size-3.5" />
              Convert Another File
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </div>
      </div>
    );
  }

  if (detectedFiles.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {initialFormatPair && (
          <p className="text-center text-sm text-muted-foreground">
            Drop a <span className="font-medium text-foreground">{getFormat(initialFormatPair.from)?.label ?? initialFormatPair.from.toUpperCase()}</span> file to
            convert it straight to <span className="font-medium text-foreground">{getFormat(initialFormatPair.to)?.label ?? initialFormatPair.to.toUpperCase()}</span>.
          </p>
        )}
        <UploadZone onFilesSelected={handleFilesSelected} />
      </div>
    );
  }

  const pairKey = inputFormat && outputFormat ? `${inputFormat}:${outputFormat}` : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {detectedFiles.map((d, i) => (
          <DetectedFileCard key={`${d.file.name}-${i}`} detected={d} onRemove={() => removeFile(i)} />
        ))}
      </div>

      {inputFormat && (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Wand2 className="size-3.5 text-primary" />
            <p className="text-sm font-medium">
              Convert {inputFormatDef?.label ?? inputFormat.toUpperCase()} to
              {detectedFiles.length > 1 ? ` (${detectedFiles.length} files)` : ""}…
            </p>
          </div>
          <FormatPicker inputFormat={inputFormat} selected={outputFormat} onSelect={setOutputFormat} />
        </div>
      )}

      {outputFormat && inputFormat && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold uppercase">{inputFormat}</span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
              <span className="font-semibold uppercase">{outputFormat}</span>
            </div>
            {pairKey && (
              <Button variant="ghost" size="icon" className="size-7" aria-label="Toggle favorite" onClick={() => toggleFavoritePair(pairKey)}>
                <Star className={cn("size-4", isFavoritePair(pairKey) && "fill-yellow-400 text-yellow-500")} />
              </Button>
            )}
          </div>

          <ConversionOptionsPanel
            inputFormat={inputFormat}
            outputFormat={outputFormat}
            options={options}
            onChange={setOptions}
            fileCount={detectedFiles.length}
            previewFile={detectedFiles[0]?.file}
          />

          <Button className="mt-4 w-full gap-1.5" disabled={converting} onClick={() => void handleConvert()}>
            <Wand2 className="size-4" />
            {converting ? "Converting…" : "Convert"}
          </Button>
        </div>
      )}
    </div>
  );
}
