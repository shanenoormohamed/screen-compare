import { ActionButton } from './ActionButton';
import { ImageCell } from './ImageCell';
import { applyBeforeAfterColumns } from '../lib/table';
import type { CellImage, TableState } from '../types';

type TableEditorProps = {
  table: TableState;
  onChange: (table: TableState) => void;
};

export function TableEditor({ table, onChange }: TableEditorProps) {
  const patch = (partial: Partial<TableState>) =>
    onChange({ ...table, ...partial });

  const setColumnTitle = (index: number, value: string) => {
    const columnTitles = [...table.columnTitles];
    columnTitles[index] = value;
    patch({ columnTitles });
  };

  const setRowTitle = (index: number, value: string) => {
    const rowTitles = [...table.rowTitles];
    rowTitles[index] = value;
    patch({ rowTitles });
  };

  const setCell = (row: number, col: number, cell: CellImage | null) => {
    const cells = table.cells.map((rowCells, rowIndex) =>
      rowIndex === row
        ? rowCells.map((existing, colIndex) =>
            colIndex === col ? cell : existing,
          )
        : rowCells,
    );
    patch({ cells });
  };

  const clearCell = (row: number, col: number) => {
    const existing = table.cells[row]?.[col];
    if (existing?.previewUrl) URL.revokeObjectURL(existing.previewUrl);
    setCell(row, col, null);
  };

  return (
    <section className="table-editor">
      <h2>Table</h2>
      <p className="table-editor__hint">
        Edit column and row titles. Drop a screenshot into each cell.
      </p>
      {table.cols === 2 && (
        <ActionButton
          className="table-editor__preset"
          onClick={() => onChange(applyBeforeAfterColumns(table))}
        >
          Set columns to Before / After
        </ActionButton>
      )}
      <div className="table-editor__scroll">
        <table>
          <thead>
            <tr>
              <th className="table-editor__corner" />
              {table.columnTitles.map((title, colIndex) => (
                <th key={colIndex}>
                  <input
                    type="text"
                    value={title}
                    aria-label={`Column ${colIndex + 1} title`}
                    onChange={(event) =>
                      setColumnTitle(colIndex, event.target.value)
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rowTitles.map((rowTitle, rowIndex) => (
              <tr key={rowIndex}>
                <th>
                  <input
                    type="text"
                    value={rowTitle}
                    aria-label={`Row ${rowIndex + 1} title`}
                    onChange={(event) =>
                      setRowTitle(rowIndex, event.target.value)
                    }
                  />
                </th>
                {table.cells[rowIndex].map((cell, colIndex) => (
                  <td key={colIndex}>
                    <ImageCell
                      cell={cell}
                      onSet={(next) => setCell(rowIndex, colIndex, next)}
                      onClear={() => clearCell(rowIndex, colIndex)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
