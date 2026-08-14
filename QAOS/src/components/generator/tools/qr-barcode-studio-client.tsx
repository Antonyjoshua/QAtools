"use client";

import * as React from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CodeType = "qr" | "code128" | "ean13";

export function QrBarcodeStudioClient() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [type, setType] = React.useState<CodeType>("qr");
  const [text, setText] = React.useState("https://testdatahub.dev/p/sample-product");
  const [error, setError] = React.useState<string | null>(null);

  const render = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError(null);
    try {
      if (type === "qr") {
        await QRCode.toCanvas(canvas, text || " ", { width: 320, margin: 1, color: { dark: "#111111", light: "#ffffff" } });
      } else {
        const value = type === "ean13" ? text.replace(/\D/g, "").padEnd(12, "0").slice(0, 12) : text || " ";
        JsBarcode(canvas, value, {
          format: type === "ean13" ? "EAN13" : "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          margin: 10,
        });
      }
    } catch {
      setError("Unable to render code for this input — try different text.");
    }
  }, [type, text]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-render canvas when inputs change
    render();
  }, [render]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-code.png`;
    a.click();
    toast.success("Downloaded PNG");
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Code type</Label>
          <Select value={type} onValueChange={(v) => v !== null && setType(v as CodeType)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(v: CodeType) =>
                  ({ qr: "QR Code", code128: "Barcode — Code 128 (any text)", ean13: "Barcode — EAN-13 (numeric)" })[v] ?? v
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qr">QR Code</SelectItem>
              <SelectItem value="code128">Barcode — Code 128 (any text)</SelectItem>
              <SelectItem value="ean13">Barcode — EAN-13 (numeric)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">{type === "qr" ? "Data to encode" : "Text / digits"}</Label>
          {type === "qr" ? (
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="URL, product code, or any text" />
          ) : (
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={type === "ean13" ? "123456789012" : "Any text"} />
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={render} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
          <Button onClick={handleDownload} className="flex-1 gap-1.5">
            <Download className="size-3.5" />
            Download PNG
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
        <canvas ref={canvasRef} className="max-w-full rounded-lg bg-white p-4 shadow-lg" />
      </div>
    </div>
  );
}
