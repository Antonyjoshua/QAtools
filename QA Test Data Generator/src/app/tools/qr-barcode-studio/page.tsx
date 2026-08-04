import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QrBarcodeStudioClient } from "@/components/tools/qr-barcode-studio-client";

export default function QrBarcodeStudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/category/ecommerce" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to E-commerce
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">QR / Barcode Studio</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted-foreground">
        Render real, scannable QR codes and barcodes from any text or product code, then download as PNG.
      </p>
      <QrBarcodeStudioClient />
    </div>
  );
}
