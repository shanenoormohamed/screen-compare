import { useCallback, useState } from 'react';
import { MAX_GRID } from '../types';

type GridPickerProps = {
  rows: number;
  cols: number;
  onSelect: (rows: number, cols: number) => void;
};

export function GridPicker({ rows, cols, onSelect }: GridPickerProps) {
  const [hover, setHover] = useState({ rows: 0, cols: 0 });
  const [dragging, setDragging] = useState(false);

  const previewRows = dragging ? hover.rows : rows;
  const previewCols = dragging ? hover.cols : cols;

  const handleCellEnter = useCallback(
    (r: number, c: number) => {
      if (!dragging) return;
      setHover({ rows: r + 1, cols: c + 1 });
    },
    [dragging],
  );

  const commitSelection = useCallback(
    (r: number, c: number) => {
      onSelect(r + 1, c + 1);
      setDragging(false);
      setHover({ rows: 0, cols: 0 });
    },
    [onSelect],
  );

  return (
    <section className="grid-picker">
      <h2>Table size</h2>
      <p className="grid-picker__hint">
        Click and drag across the boxes to pick rows and columns — like inserting
        a table in a doc.
      </p>
      <p className="grid-picker__size" aria-live="polite">
        {previewRows > 0 && previewCols > 0
          ? `${previewRows} × ${previewCols} table`
          : `${rows} × ${cols} table`}
      </p>
      <div
        className="grid-picker__matrix"
        onMouseLeave={() => {
          if (dragging) return;
          setHover({ rows: 0, cols: 0 });
        }}
      >
        {Array.from({ length: MAX_GRID }, (_, row) => (
          <div key={row} className="grid-picker__row">
            {Array.from({ length: MAX_GRID }, (_, col) => {
              const active =
                row < previewRows && col < previewCols && previewRows > 0;
              return (
                <button
                  key={col}
                  type="button"
                  className={`grid-picker__cell ${active ? 'grid-picker__cell--active' : ''}`}
                  aria-label={`${row + 1} by ${col + 1}`}
                  onMouseDown={() => {
                    setDragging(true);
                    setHover({ rows: row + 1, cols: col + 1 });
                  }}
                  onMouseEnter={() => handleCellEnter(row, col)}
                  onMouseUp={() => commitSelection(row, col)}
                >
                  <span className="grid-picker__cell-inner" />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
