import { Fragment } from 'react'
import type { GridState } from '../types'
import { CellCard } from './CellCard'

interface Props {
  grid: GridState
  onColumnLabelChange: (colIdx: number, label: string) => void
  onRowLabelChange: (rowIdx: number, label: string) => void
  onImageSet: (rowIdx: number, colIdx: number, file: File) => void
  onImageClear: (rowIdx: number, colIdx: number) => void
  onAddRow: () => void
  onRemoveRow: (rowIdx: number) => void
  onAddColumn: () => void
  onRemoveColumn: (colIdx: number) => void
}

export function CompareGrid({
  grid,
  onColumnLabelChange,
  onRowLabelChange,
  onImageSet,
  onImageClear,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
}: Props) {
  const numRows = grid.rowLabels.length
  const numCols = grid.columnLabels.length

  return (
    <div
      className="compare-table"
      style={{
        gridTemplateColumns: `160px repeat(${numCols}, minmax(180px, 1fr)) auto`,
      }}
    >
      {/* Top-left corner — empty */}
      <div
        className="compare-table__corner"
        style={{ gridRow: 1, gridColumn: 1 }}
      />

      {/* Column headers */}
      {grid.columnLabels.map((label, colIdx) => (
        <div
          key={`col-${colIdx}`}
          className="compare-table__col-header"
          style={{ gridRow: 1, gridColumn: colIdx + 2 }}
        >
          <input
            type="text"
            className="grid-label-input"
            value={label}
            onChange={(e) => onColumnLabelChange(colIdx, e.target.value)}
            placeholder="Column label…"
          />
          <button
            type="button"
            className="grid-remove-btn"
            onClick={() => onRemoveColumn(colIdx)}
            disabled={numCols <= 1}
            title="Remove column"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add column button */}
      <div
        className="compare-table__add-col"
        style={{ gridRow: 1, gridColumn: numCols + 2 }}
      >
        <button type="button" className="add-axis-btn" onClick={onAddColumn}>
          + Col
        </button>
      </div>

      {/* Data rows */}
      {grid.rowLabels.map((rowLabel, rowIdx) => (
        <Fragment key={rowIdx}>
          <div
            className="compare-table__row-header"
            style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
          >
            <input
              type="text"
              className="grid-label-input"
              value={rowLabel}
              onChange={(e) => onRowLabelChange(rowIdx, e.target.value)}
              placeholder="Row label…"
            />
            <button
              type="button"
              className="grid-remove-btn"
              onClick={() => onRemoveRow(rowIdx)}
              disabled={numRows <= 1}
              title="Remove row"
            >
              ×
            </button>
          </div>

          {grid.cells[rowIdx].map((cell, colIdx) => (
            <div
              key={cell.id}
              className="compare-table__cell"
              style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}
            >
              <CellCard
                cell={cell}
                onImageSet={(file) => onImageSet(rowIdx, colIdx, file)}
                onImageClear={() => onImageClear(rowIdx, colIdx)}
              />
            </div>
          ))}
        </Fragment>
      ))}

      {/* Add row button */}
      <div
        className="compare-table__add-row"
        style={{ gridRow: numRows + 2, gridColumn: `1 / span ${numCols + 2}` }}
      >
        <button type="button" className="add-axis-btn" onClick={onAddRow}>
          + Add Row
        </button>
      </div>
    </div>
  )
}
