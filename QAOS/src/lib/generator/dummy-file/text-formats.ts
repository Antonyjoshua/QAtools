const enc = new TextEncoder();

/** Grows an ASCII-only body with a repeating filler line until it reaches targetBytes, then trims exactly. */
function growAndTrim(header: string, filler: string, targetBytes: number): Uint8Array {
  let body = header;
  while (enc.encode(body).length < targetBytes) {
    body += filler;
  }
  return enc.encode(body).slice(0, targetBytes);
}

export function generateTxt(targetBytes: number): Uint8Array {
  const header = `QA Dummy Test File\nGenerated: ${new Date().toISOString()}\nTarget size: ${targetBytes} bytes\n\n`;
  const filler = "The quick brown fox jumps over the lazy dog. This line pads the file to the requested size.\n";
  return growAndTrim(header, filler, targetBytes);
}

export function generateCsv(targetBytes: number): Uint8Array {
  const header = "id,name,email,department,city,created_at\n";
  let body = header;
  let i = 1;
  while (enc.encode(body).length < targetBytes) {
    const day = (i % 28) + 1;
    body += `${i},QA User ${i},qauser${i}@example.test,Engineering,Springfield,2026-01-${String(day).padStart(2, "0")}\n`;
    i++;
  }
  return enc.encode(body).slice(0, targetBytes);
}

/** Builds a JSON array of records, then tops up an exact-length ASCII "padding" field on one
 * extra record so the final serialized size matches targetBytes exactly (no truncation, so the
 * JSON always stays syntactically valid).
 *
 * The padding length is found by direct measurement rather than estimation: build once with an
 * empty padding string, measure the real byte length, fill the exact shortfall with 'x' characters
 * (each contributing exactly one byte, no JSON escaping involved), then re-measure once more to
 * correct for any edge case (e.g. growth stopping exactly at the target) — this two-pass
 * measure-and-correct converges exactly regardless of how the skeleton size happened to land. */
function growWithExactPadding<T>(
  buildItem: (i: number) => T,
  render: (items: T[], padding: string) => string,
  targetBytes: number
): Uint8Array {
  const items: T[] = [];
  let i = 0;
  const maxItems = 2_000_000;

  while (i < maxItems) {
    const candidate = [...items, buildItem(i)];
    if (enc.encode(render(candidate, "")).length >= targetBytes) break;
    items.push(candidate[candidate.length - 1]);
    i++;
  }
  // Growth stops just under target, but the boundary can occasionally land at-or-over once the
  // (empty-padding) skeleton itself is measured — shrink back until there's real room for padding.
  while (items.length > 0 && enc.encode(render(items, "")).length > targetBytes) {
    items.pop();
  }

  let paddingLen = Math.max(0, targetBytes - enc.encode(render(items, "")).length);
  let output = enc.encode(render(items, "x".repeat(paddingLen)));
  const diff = targetBytes - output.length;
  if (diff !== 0) {
    paddingLen = Math.max(0, paddingLen + diff);
    output = enc.encode(render(items, "x".repeat(paddingLen)));
  }
  return output;
}

export function generateJson(targetBytes: number): Uint8Array {
  return growWithExactPadding<Record<string, unknown>>(
    (i) => ({ id: i + 1, name: `QA User ${i + 1}`, email: `qauser${i + 1}@example.test` }),
    (records, padding) => JSON.stringify([...records, { padding }]),
    targetBytes
  );
}

/** Same exact-padding technique as JSON, using a trailing <padding> element. */
export function generateXml(targetBytes: number): Uint8Array {
  return growWithExactPadding<string>(
    (i) => `  <record><id>${i + 1}</id><name>QA User ${i + 1}</name></record>`,
    (rows, padding) =>
      `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n${rows.join("\n")}\n  <record><padding>${padding}</padding></record>\n</records>\n`,
    targetBytes
  );
}

/** Same exact-padding technique, using a trailing hidden <div>. */
export function generateHtml(targetBytes: number): Uint8Array {
  return growWithExactPadding<string>(
    (i) => `<tr><td>${i + 1}</td><td>QA User ${i + 1}</td><td>qauser${i + 1}@example.test</td></tr>`,
    (rows, padding) =>
      `<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>QA Dummy Test File</title></head><body>\n` +
      `<h1>QA Dummy Test File</h1>\n<table border="1">\n<tr><th>ID</th><th>Name</th><th>Email</th></tr>\n` +
      `${rows.join("\n")}\n</table>\n<div style="display:none">${padding}</div>\n</body></html>\n`,
    targetBytes
  );
}

/** crypto.getRandomValues() caps out at 65536 bytes per call, so fill in chunks. */
export function generateBin(targetBytes: number): Uint8Array {
  const bytes = new Uint8Array(targetBytes);
  const CHUNK = 65536;
  for (let offset = 0; offset < bytes.length; offset += CHUNK) {
    const end = Math.min(offset + CHUNK, bytes.length);
    crypto.getRandomValues(bytes.subarray(offset, end));
  }
  return bytes;
}

export function randomBytes(length: number): Uint8Array {
  return generateBin(length);
}
