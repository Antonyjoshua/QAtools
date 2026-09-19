import type { DummyFileFormat, GeneratedDummyFile } from "./types";
import { getDummyFileFormatDef } from "./types";
import { generateTxt, generateCsv, generateJson, generateXml, generateHtml, generateBin } from "./text-formats";
import { generateImage } from "./image-formats";
import { generateDocx, generateXlsx, generateZip, generatePdf } from "./document-formats";

export async function generateDummyFile(format: DummyFileFormat, targetBytes: number): Promise<GeneratedDummyFile> {
  const def = getDummyFileFormatDef(format);
  const clampedTarget = Math.max(0, Math.round(targetBytes));

  let bytes: Uint8Array;
  switch (format) {
    case "txt":
      bytes = generateTxt(clampedTarget);
      break;
    case "csv":
      bytes = generateCsv(clampedTarget);
      break;
    case "json":
      bytes = generateJson(clampedTarget);
      break;
    case "xml":
      bytes = generateXml(clampedTarget);
      break;
    case "html":
      bytes = generateHtml(clampedTarget);
      break;
    case "bin":
      bytes = generateBin(clampedTarget);
      break;
    case "png":
    case "jpg":
      bytes = await generateImage(format, clampedTarget);
      break;
    case "pdf":
      bytes = await generatePdf(clampedTarget);
      break;
    case "docx":
      bytes = await generateDocx(clampedTarget);
      break;
    case "xlsx":
      bytes = await generateXlsx(clampedTarget);
      break;
    case "zip":
      bytes = await generateZip(clampedTarget);
      break;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    bytes,
    filename: `qa-dummy-${clampedTarget}b-${stamp}.${def.extension}`,
    mimeType: def.mimeType,
    requestedBytes: clampedTarget,
    actualBytes: bytes.length,
  };
}
