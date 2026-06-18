import { useCallback, useMemo, useState } from 'react'
import { ExportButton } from './components/ExportButton'
import { GridPicker } from './components/GridPicker'
import { TableEditor } from './components/TableEditor'
import {
  createDefaultTable,
  normalizeRowTitles,
  resizeTable,
} from './lib/table'
import type { TableState } from './types'
import './App.css'

function App() {
  const [table, setTable] = useState<TableState>(() => createDefaultTable())

  const updateTable = useCallback(
    (updater: TableState | ((prev: TableState) => TableState)) => {
      setTable((prev) =>
        normalizeRowTitles(
          typeof updater === 'function' ? updater(prev) : updater,
        ),
      )
    },
    [],
  )

  const handleGridSelect = useCallback(
    (rows: number, cols: number) => {
      updateTable((prev) => resizeTable(prev, rows, cols))
    },
    [updateTable],
  )

  const hasAnyImage = useMemo(
    () => table.cells.some((row) => row.some((cell) => cell !== null)),
    [table.cells],
  )

  return (
    <div className="app">
      <header className="app__header">
        <h1>Screen Compare</h1>
        <p>
          Pick the grid size, label rows and columns, drop screenshots, export
          to PDF.
        </p>
      </header>

      <GridPicker
        rows={table.rows}
        cols={table.cols}
        onSelect={handleGridSelect}
      />

      <TableEditor table={table} onChange={updateTable} />

      <section className="export-section">
        <ExportButton table={table} disabled={!hasAnyImage} />
      </section>
    </div>
  )
}

export default App
