import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { randomBytes } from "./text-formats";
import { addPaddingViaZipEntry } from "./zip-padding";

export async function generateDocx(targetBytes: number): Promise<Uint8Array> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "QA Dummy Test Document", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun(`Generated: ${new Date().toISOString()}`)] }),
          new Paragraph({ children: [new TextRun(`Target size: ${targetBytes} bytes`)] }),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  const base = new Uint8Array(await blob.arrayBuffer());
  return addPaddingViaZipEntry(base, targetBytes);
}

export async function generateXlsx(targetBytes: number): Promise<Uint8Array> {
  const ws = XLSX.utils.aoa_to_sheet([
    ["QA Dummy Test Spreadsheet"],
    ["Generated", new Date().toISOString()],
    ["Target size (bytes)", targetBytes],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const base = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return addPaddingViaZipEntry(new Uint8Array(base), targetBytes);
}

export async function generateZip(targetBytes: number): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file(
    "readme.txt",
    `QA Dummy Test Archive\nGenerated: ${new Date().toISOString()}\nTarget size: ${targetBytes} bytes\n`
  );
  const base = await zip.generateAsync({ type: "uint8array" });
  return addPaddingViaZipEntry(base, targetBytes);
}

async function buildPdf(paddingSize: number, targetBytes: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText("QA Dummy Test PDF", { x: 50, y: 780, size: 20, font, color: rgb(0.18, 0.44, 1) });
  page.drawText(`Generated: ${new Date().toISOString()}`, { x: 50, y: 750, size: 12, font });
  page.drawText(`Target size: ${targetBytes} bytes`, { x: 50, y: 730, size: 12, font });

  if (paddingSize > 0) {
    await pdfDoc.attach(randomBytes(paddingSize), "qa-padding.bin", {
      mimeType: "application/octet-stream",
      description: "QA test padding data",
    });
  }
  return pdfDoc.save();
}

/** Same two-pass convergence idea as the zip padding helper, via PDF's file-attachment mechanism. */
export async function generatePdf(targetBytes: number): Promise<Uint8Array> {
  let bytes = await buildPdf(0, targetBytes);
  if (bytes.length >= targetBytes) return bytes;

  let paddingSize = targetBytes - bytes.length;
  bytes = await buildPdf(paddingSize, targetBytes);
  const diff = targetBytes - bytes.length;
  if (diff !== 0) {
    paddingSize = Math.max(0, paddingSize + diff);
    bytes = await buildPdf(paddingSize, targetBytes);
  }
  return bytes;
}
