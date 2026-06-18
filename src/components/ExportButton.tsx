import { useState } from 'react';
import { jsPDF } from 'jspdf';
import type { TableState } from '../types';

interface Props {
  table: TableState;
  disabled: boolean;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function ExportButton({ table, disabled }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const margin = 24;
      const titleHeight = 32;
      const rowLabelColWidth = 80;
      const colHeaderRowHeight = 24;
      const gutter = 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      doc.text('Screen Compare', margin, margin + 16);

      const tableTop = margin + titleHeight;
      const tableLeft = margin;
      const tableWidth = pageWidth - margin * 2;
      const tableHeight = pageHeight - tableTop - margin;

      const numCols = table.cols;
      const numRows = table.rows;

      const dataColsWidth = tableWidth - rowLabelColWidth - gutter;
      const colWidth = (dataColsWidth - gutter * (numCols - 1)) / numCols;

      const dataRowsHeight = tableHeight - colHeaderRowHeight - gutter;
      const rowHeight = (dataRowsHeight - gutter * (numRows - 1)) / numRows;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      for (let c = 0; c < numCols; c++) {
        const x =
          tableLeft + rowLabelColWidth + gutter + c * (colWidth + gutter);
        const y = tableTop;
        doc.setFillColor(243, 244, 246);
        doc.setDrawColor(229, 231, 235);
        doc.rect(x, y, colWidth, colHeaderRowHeight, 'FD');
        doc.text(
          table.columnTitles[c] || `Col ${c + 1}`,
          x + 4,
          y + colHeaderRowHeight - 7,
          { maxWidth: colWidth - 8 },
        );
      }

      for (let r = 0; r < numRows; r++) {
        const rowY =
          tableTop + colHeaderRowHeight + gutter + r * (rowHeight + gutter);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(17, 24, 39);
        doc.setFillColor(243, 244, 246);
        doc.setDrawColor(229, 231, 235);
        doc.rect(tableLeft, rowY, rowLabelColWidth, rowHeight, 'FD');
        const rowLabelLines = doc.splitTextToSize(
          table.rowTitles[r] || `Row ${r + 1}`,
          rowLabelColWidth - 8,
        );
        doc.text(rowLabelLines, tableLeft + 4, rowY + 12);

        for (let c = 0; c < numCols; c++) {
          const cellX =
            tableLeft + rowLabelColWidth + gutter + c * (colWidth + gutter);
          const cell = table.cells[r][c];

          if (!cell || cell.kind === 'video') {
            doc.setDrawColor(229, 231, 235);
            doc.setFillColor(249, 250, 251);
            doc.rect(cellX, rowY, colWidth, rowHeight, 'FD');
            if (cell?.kind === 'video') {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.setTextColor(107, 114, 128);
              doc.text('Video', cellX + colWidth / 2, rowY + rowHeight / 2, {
                align: 'center',
              });
            }
            continue;
          }

          try {
            const img = await loadImage(cell.previewUrl);
            const scaleW = colWidth / img.naturalWidth;
            const scaleH = rowHeight / img.naturalHeight;
            const scale = Math.min(scaleW, scaleH);
            const drawW = img.naturalWidth * scale;
            const drawH = img.naturalHeight * scale;
            const drawX = cellX + (colWidth - drawW) / 2;
            const drawY = rowY + (rowHeight - drawH) / 2;
            const format = cell.file.type === 'image/png' ? 'PNG' : 'JPEG';
            doc.addImage(cell.previewUrl, format, drawX, drawY, drawW, drawH);
          } catch {
            doc.setDrawColor(229, 231, 235);
            doc.setFillColor(249, 250, 251);
            doc.rect(cellX, rowY, colWidth, rowHeight, 'FD');
          }
        }
      }

      doc.save('screen-compare.pdf');
    } finally {
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      className="export-btn"
      onClick={handleExport}
      disabled={disabled || exporting}
    >
      {exporting ? 'Generating…' : 'Generate PDF'}
    </button>
  );
}
