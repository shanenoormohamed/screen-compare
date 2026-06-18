import { useCallback, useMemo, useState } from 'react'
import { CompareGrid } from './components/CompareGrid'
import { ExportButton } from './components/ExportButton'
import type { Cell, GridState } from './types'
import './App.css'

function createCell(): Cell {
  return { id: crypto.randomUUID(), imageUrl: null, imageFile: null }
}

function createRow(numCols: number): Cell[] {
  return Array.from({ length: numCols }, () => createCell())
}

const DEFAULT_STATE: GridState = {
  columnLabels: ['Before (main)', 'After (branch)'],
  rowLabels: ['iOS', 'Android'],
  cells: [
    [createCell(), createCell()],
    [createCell(), createCell()],
  ],
}

function App() {
  const [grid, setGrid] = useState<GridState>(DEFAULT_STATE)

  const hasAnyImage = useMemo(
    () => grid.cells.some((row) => row.some((cell) => cell.imageUrl !== null)),
    [grid.cells]
  )

  const handleColumnLabelChange = useCallback((colIdx: number, label: string) => {
    setGrid((prev) => {
      const columnLabels = [...prev.columnLabels]
      columnLabels[colIdx] = label
      return { ...prev, columnLabels }
    })
  }, [])

  const handleRowLabelChange = useCallback((rowIdx: number, label: string) => {
    setGrid((prev) => {
      const rowLabels = [...prev.rowLabels]
      rowLabels[rowIdx] = label
      return { ...prev, rowLabels }
    })
  }, [])

  const handleImageSet = useCallback((rowIdx: number, colIdx: number, file: File) => {
    const url = URL.createObjectURL(file)
    setGrid((prev) => {
      const cells = prev.cells.map((row, r) =>
        row.map((cell, c) => {
          if (r !== rowIdx || c !== colIdx) return cell
          if (cell.imageUrl) URL.revokeObjectURL(cell.imageUrl)
          return { ...cell, imageUrl: url, imageFile: file }
        })
      )
      return { ...prev, cells }
    })
  }, [])

  const handleImageClear = useCallback((rowIdx: number, colIdx: number) => {
    setGrid((prev) => {
      const cells = prev.cells.map((row, r) =>
        row.map((cell, c) => {
          if (r !== rowIdx || c !== colIdx) return cell
          if (cell.imageUrl) URL.revokeObjectURL(cell.imageUrl)
          return { ...cell, imageUrl: null, imageFile: null }
        })
      )
      return { ...prev, cells }
    })
  }, [])

  const handleAddRow = useCallback(() => {
    setGrid((prev) => ({
      ...prev,
      rowLabels: [...prev.rowLabels, `Row ${prev.rowLabels.length + 1}`],
      cells: [...prev.cells, createRow(prev.columnLabels.length)],
    }))
  }, [])

  const handleRemoveRow = useCallback((rowIdx: number) => {
    setGrid((prev) => {
      if (prev.rowLabels.length <= 1) return prev
      prev.cells[rowIdx].forEach((cell) => {
        if (cell.imageUrl) URL.revokeObjectURL(cell.imageUrl)
      })
      return {
        ...prev,
        rowLabels: prev.rowLabels.filter((_, i) => i !== rowIdx),
        cells: prev.cells.filter((_, i) => i !== rowIdx),
      }
    })
  }, [])

  const handleAddColumn = useCallback(() => {
    setGrid((prev) => ({
      ...prev,
      columnLabels: [...prev.columnLabels, `Col ${prev.columnLabels.length + 1}`],
      cells: prev.cells.map((row) => [...row, createCell()]),
    }))
  }, [])

  const handleRemoveColumn = useCallback((colIdx: number) => {
    setGrid((prev) => {
      if (prev.columnLabels.length <= 1) return prev
      prev.cells.forEach((row) => {
        const cell = row[colIdx]
        if (cell.imageUrl) URL.revokeObjectURL(cell.imageUrl)
      })
      return {
        ...prev,
        columnLabels: prev.columnLabels.filter((_, i) => i !== colIdx),
        cells: prev.cells.map((row) => row.filter((_, i) => i !== colIdx)),
      }
    })
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <h1>Screen Compare</h1>
        <p>Compare screenshots in a grid with row and column labels. Export to PDF.</p>
      </header>

      <div className="app__toolbar">
        <ExportButton grid={grid} disabled={!hasAnyImage} />
      </div>

      <CompareGrid
        grid={grid}
        onColumnLabelChange={handleColumnLabelChange}
        onRowLabelChange={handleRowLabelChange}
        onImageSet={handleImageSet}
        onImageClear={handleImageClear}
        onAddRow={handleAddRow}
        onRemoveRow={handleRemoveRow}
        onAddColumn={handleAddColumn}
        onRemoveColumn={handleRemoveColumn}
      />
    </div>
  )
}

export default App
