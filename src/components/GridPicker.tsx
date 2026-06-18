import { useCallback, useState } from 'react'
import { MAX_COLS, MAX_ROWS } from '../types'

type GridPickerProps = {
  rows: number
  cols: number
  onDraftChange: (rows: number, cols: number) => void
  onGenerate: () => void
}

export function GridPicker({
  rows,
  cols,
  onDraftChange,
  onGenerate,
}: GridPickerProps) {
  const [hover, setHover] = useState({ rows: 0, cols: 0 })
  const [dragging, setDragging] = useState(false)

  const previewRows = dragging ? hover.rows : rows
  const previewCols = dragging ? hover.cols : cols

  const handleCellEnter = useCallback(
    (r: number, c: number) => {
      if (!dragging) return
      setHover({ rows: r + 1, cols: c + 1 })
    },
    [dragging],
  )

  const commitSelection = useCallback(
    (r: number, c: number) => {
      onDraftChange(r + 1, c + 1)
      setDragging(false)
      setHover({ rows: 0, cols: 0 })
    },
    [onDraftChange],
  )

  return (
    <section className="grid-picker">
      <h2>Table size</h2>
      <p className="grid-picker__hint">
        Click and drag across the boxes to pick rows and columns — like inserting
        a table in a doc.
      </p>
      <p className="grid-picker__size" aria-live="polite">
        {previewRows} × {previewCols} table
      </p>
      <div
        className="grid-picker__matrix"
        onMouseLeave={() => {
          if (dragging) return
          setHover({ rows: 0, cols: 0 })
        }}
      >
        {Array.from({ length: MAX_ROWS }, (_, row) => (
          <div key={row} className="grid-picker__row">
            {Array.from({ length: MAX_COLS }, (_, col) => {
              const active =
                row < previewRows && col < previewCols && previewRows > 0
              return (
                <button
                  key={col}
                  type="button"
                  className={`grid-picker__cell ${active ? 'grid-picker__cell--active' : ''}`}
                  aria-label={`${row + 1} by ${col + 1}`}
                  onMouseDown={() => {
                    setDragging(true)
                    setHover({ rows: row + 1, cols: col + 1 })
                  }}
                  onMouseEnter={() => handleCellEnter(row, col)}
                  onMouseUp={() => commitSelection(row, col)}
                >
                  <span className="grid-picker__cell-inner" />
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="generate-layout-btn"
        onClick={onGenerate}
      >
        Generate layout
      </button>
    </section>
  )
}
