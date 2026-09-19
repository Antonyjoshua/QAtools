import JSZip from "jszip";
import { randomBytes } from "./text-formats";

const PADDING_ENTRY_NAME = "qa-padding.bin";

/**
 * Adds a STORE-compressed (uncompressed) padding entry to a zip-based file (docx/xlsx/zip are all
 * zip containers) to reach an exact target size. Since STORE means entry size == data size, and
 * the fixed per-entry header/central-directory overhead for a given filename is constant, two
 * passes converge exactly: the first measures the real total overhead, the second corrects the
 * padding size by the exact discrepancy.
 */
export async function addPaddingViaZipEntry(baseBytes: Uint8Array, targetBytes: number): Promise<Uint8Array> {
  if (baseBytes.length >= targetBytes) return baseBytes;

  const zip = await JSZip.loadAsync(baseBytes);

  let paddingSize = Math.max(0, targetBytes - baseBytes.length - 80);
  zip.file(PADDING_ENTRY_NAME, randomBytes(paddingSize), { compression: "STORE" });
  let output = await zip.generateAsync({ type: "uint8array" });

  const diff = targetBytes - output.length;
  if (diff !== 0) {
    paddingSize = Math.max(0, paddingSize + diff);
    zip.file(PADDING_ENTRY_NAME, randomBytes(paddingSize), { compression: "STORE" });
    output = await zip.generateAsync({ type: "uint8array" });
  }

  return output;
}
