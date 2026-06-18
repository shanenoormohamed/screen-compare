import { useState } from 'react';
import { jsPDF } from 'jspdf';
import type { TableState } from '../types';

interface Props {
  table: TableState;
  disabled: boolean;
}

const MARGIN = 16;
const TITLE_HEIGHT = 28;
const ROW_LABEL_COL_WIDTH = 56;
const COL_HEADER_ROW_HEIGHT = 18;
const GUTTER = 4;
const ROWS_PER_PAGE = 2;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function fitImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
  return {
    width: img.naturalWidth * scale,
    height: img.naturalHeight * scale,
  };
}

export function ExportButton({ table, disabled }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const tableLeft = MARGIN;
      const tableWidth = pageWidth - MARGIN * 2;

      const numCols = table.cols;
      const numRows = table.rows;
      const pages = Math.ceil(numRows / ROWS_PER_PAGE);

      const dataColsWidth = tableWidth - ROW_LABEL_COL_WIDTH - GUTTER;
      const colWidth = (dataColsWidth - GUTTER * (numCols - 1)) / numCols;

      for (let page = 0; page < pages; page++) {
        if (page > 0) doc.addPage('a4', 'portrait');

        const startRow = page * ROWS_PER_PAGE;
        const endRow = Math.min(startRow + ROWS_PER_PAGE, numRows);
        const rowsOnPage = endRow - startRow;

        const tableTop = page === 0 ? MARGIN + TITLE_HEIGHT : MARGIN;
        const tableHeight = pageHeight - tableTop - MARGIN;
        const dataRowsHeight = tableHeight - COL_HEADER_ROW_HEIGHT - GUTTER;
        const rowHeight =
          rowsOnPage === 1
            ? dataRowsHeight
            : (dataRowsHeight - GUTTER) / ROWS_PER_PAGE;

        if (page === 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(17, 24, 39);
          doc.text('Screen Compare', MARGIN, MARGIN + 16);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(17, 24, 39);
        for (let c = 0; c < numCols; c++) {
          const x =
            tableLeft + ROW_LABEL_COL_WIDTH + GUTTER + c * (colWidth + GUTTER);
          const y = tableTop;
          doc.setFillColor(243, 244, 246);
          doc.setDrawColor(229, 231, 235);
          doc.rect(x, y, colWidth, COL_HEADER_ROW_HEIGHT, 'FD');
          doc.text(
            table.columnTitles[c] || `Col ${c + 1}`,
            x + 4,
            y + COL_HEADER_ROW_HEIGHT - 6,
            { maxWidth: colWidth - 8 },
          );
        }

        for (let r = startRow; r < endRow; r++) {
          const rowIndexOnPage = r - startRow;
          const rowY =
            tableTop +
            COL_HEADER_ROW_HEIGHT +
            GUTTER +
            rowIndexOnPage * (rowHeight + GUTTER);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(17, 24, 39);
          doc.setFillColor(243, 244, 246);
          doc.setDrawColor(229, 231, 235);
          doc.rect(tableLeft, rowY, ROW_LABEL_COL_WIDTH, rowHeight, 'FD');
          const rowLabelLines = doc.splitTextToSize(
            table.rowTitles[r] || `Row ${r + 1}`,
            ROW_LABEL_COL_WIDTH - 8,
          );
          doc.text(rowLabelLines, tableLeft + 4, rowY + 12);

          for (let c = 0; c < numCols; c++) {
            const cellX =
              tableLeft + ROW_LABEL_COL_WIDTH + GUTTER + c * (colWidth + GUTTER);
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
              const { width: drawW, height: drawH } = fitImage(
                img,
                colWidth,
                rowHeight,
              );
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
