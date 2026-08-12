import { ImageOptionsForm } from "./options/image-options-form";
import { SpreadsheetPdfOptionsForm } from "./options/spreadsheet-pdf-options-form";
import { PdfOperationOptionsForm } from "./options/pdf-operation-options-form";
import { PdfToImageOptionsForm } from "./options/pdf-to-image-options-form";
import { JsonModeOptionsForm } from "./options/json-mode-options-form";

const IMAGE_FORMATS = new Set(["jpg", "png", "webp", "bmp", "gif", "svg"]);
const IMAGE_OUTPUTS = new Set(["jpg", "png", "webp", "ico", "svg"]);
const SPREADSHEET_FORMATS = new Set(["xlsx", "xls", "csv", "ods"]);

/** Renders only the options relevant to the given (input, output) pair — never a generic
 * catch-all form. Returns null when a conversion genuinely has nothing to configure. */
export function ConversionOptionsPanel({
  inputFormat,
  outputFormat,
  options,
  onChange,
  fileCount,
}: {
  inputFormat: string;
  outputFormat: string;
  options: Record<string, unknown>;
  onChange: (options: Record<string, unknown>) => void;
  fileCount: number;
}) {
  if (IMAGE_FORMATS.has(inputFormat) && IMAGE_OUTPUTS.has(outputFormat)) {
    return <ImageOptionsForm outputFormat={outputFormat} options={options} onChange={onChange} />;
  }
  if (SPREADSHEET_FORMATS.has(inputFormat) && outputFormat === "pdf") {
    return <SpreadsheetPdfOptionsForm options={options} onChange={onChange} />;
  }
  if (inputFormat === "pdf" && outputFormat === "pdf") {
    return <PdfOperationOptionsForm options={options} onChange={onChange} fileCount={fileCount} />;
  }
  if (inputFormat === "pdf" && (outputFormat === "jpg" || outputFormat === "png")) {
    return <PdfToImageOptionsForm outputFormat={outputFormat} options={options} onChange={onChange} />;
  }
  if (inputFormat === "json" && outputFormat === "json") {
    return <JsonModeOptionsForm options={options} onChange={onChange} />;
  }
  return null;
}
