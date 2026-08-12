import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CheatSheet } from "../content/types";

// jspdf-autotable attaches this at runtime but doesn't export types for it.
type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

export function exportCheatSheetToPDF(sheet: CheatSheet): void {
  const doc = new jsPDF() as DocWithAutoTable;
  doc.setFontSize(16);
  doc.text(sheet.title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(sheet.description, 14, 25);
  doc.setTextColor(0);

  let y = 32;
  for (const section of sheet.sections) {
    autoTable(doc, {
      startY: y,
      head: [[section.heading, ""]],
      body: section.items.map((i) => [i.term, i.description]),
      theme: "striped",
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  }

  doc.save(`${sheet.id}.pdf`);
}
