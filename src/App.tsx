import { useCallback, useMemo, useState } from 'react';
import { ExportButton } from './components/ExportButton';
import { GridPicker } from './components/GridPicker';
import { TableEditor } from './components/TableEditor';
import {
  createEmptyTable,
  normalizeRowTitles,
  resizeTable,
} from './lib/table';
import type { TableState } from './types';
import './App.css';

function App() {
  const [draftRows, setDraftRows] = useState(2);
  const [draftCols, setDraftCols] = useState(2);
  const [table, setTable] = useState<TableState | null>(null);

  const updateTable = useCallback(
    (updater: TableState | ((prev: TableState) => TableState)) => {
      setTable((prev) => {
        if (!prev) return prev;
        return normalizeRowTitles(
          typeof updater === 'function' ? updater(prev) : updater,
        );
      });
    },
    [],
  );

  const handleGridSelect = useCallback((rows: number, cols: number) => {
    setDraftRows(rows);
    setDraftCols(cols);
  }, []);

  const handleGenerateTable = useCallback(() => {
    setTable((prev) => {
      if (!prev) return createEmptyTable(draftRows, draftCols);
      return resizeTable(prev, draftRows, draftCols);
    });
  }, [draftRows, draftCols]);

  const hasAnyImage = useMemo(
    () =>
      table?.cells.some((row) => row.some((cell) => cell !== null)) ?? false,
    [table],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Screen Compare</h1>
        <p>
          Pick the grid size, generate the table, drop screenshots, export to
          PDF.
        </p>
      </header>

      <GridPicker
        rows={draftRows}
        cols={draftCols}
        onSelect={handleGridSelect}
      />

      <button
        type="button"
        className="primary-btn"
        onClick={handleGenerateTable}
      >
        Generate table
      </button>

      {table && (
        <>
          <TableEditor table={table} onChange={updateTable} />

          <section className="export-section">
            <ExportButton table={table} disabled={!hasAnyImage} />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
