import type { ConversionError } from "../core/types";

export const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: ConversionError;
}

export function validateFile(file: File): FileValidationResult {
  if (file.size === 0) {
    return { valid: false, error: { code: "corrupted-file", message: "This file appears to be empty." } };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: { code: "file-too-large", message: `This file is larger than the ${MAX_FILE_SIZE_MB}MB limit. Try compressing it first, or split it into smaller pieces.` } };
  }
  const hasExtension = /\.[a-z0-9]{1,6}$/i.test(file.name);
  if (!hasExtension) {
    return { valid: false, error: { code: "invalid-extension", message: "This file doesn't have a recognizable extension, so its type can't be determined." } };
  }
  return { valid: true };
}

export function validateFiles(files: File[]): FileValidationResult {
  for (const file of files) {
    const result = validateFile(file);
    if (!result.valid) return result;
  }
  return { valid: true };
}
