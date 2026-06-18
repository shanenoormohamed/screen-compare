import type { TableState } from '../types'

function defaultRowTitle(index: number, totalRows: number): string {
  return totalRows === 1 ? 'Screen' : `Screen ${index + 1}`
}

function isAutoRowTitle(
  title: string,
  index: number,
  totalRows: number,
): boolean {
  if (!title) return true
  if (title === `Row ${index + 1}` || title === `Screen ${index + 1}`) {
    return true
  }
  return totalRows > 1 && index === 0 && title === 'Screen'
}

export function normalizeRowTitles(table: TableState): TableState {
  const rowTitles = Array.from({ length: table.rows }, (_, index) => {
    const title = table.rowTitles[index]
    return isAutoRowTitle(title ?? '', index, table.rows)
      ? defaultRowTitle(index, table.rows)
      : (title ?? defaultRowTitle(index, table.rows))
  })

  if (rowTitles.every((title, index) => title === table.rowTitles[index])) {
    return table
  }
  return { ...table, rowTitles }
}

export function createEmptyTable(rows: number, cols: number): TableState {
  return {
    rows,
    cols,
    columnTitles: Array.from({ length: cols }, (_, i) => `Column ${i + 1}`),
    rowTitles: Array.from({ length: rows }, (_, i) => defaultRowTitle(i, rows)),
    cells: Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null),
    ),
  }
}

export function createDefaultTable(): TableState {
  return {
    rows: 2,
    cols: 2,
    columnTitles: ['Before (main)', 'After (branch)'],
    rowTitles: ['iOS', 'Android'],
    cells: Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => null),
    ),
  }
}

export function resizeTable(
  prev: TableState,
  rows: number,
  cols: number,
): TableState {
  const next = createEmptyTable(rows, cols)
  const overlapRows = Math.min(rows, prev.rows)
  const overlapCols = Math.min(cols, prev.cols)

  for (let r = 0; r < overlapRows; r += 1) {
    next.rowTitles[r] = prev.rowTitles[r] ?? next.rowTitles[r]
    for (let c = 0; c < overlapCols; c += 1) {
      next.columnTitles[c] = prev.columnTitles[c] ?? next.columnTitles[c]
      next.cells[r][c] = prev.cells[r][c] ?? null
    }
  }

  return next
}

export function applyBeforeAfterColumns(table: TableState): TableState {
  if (table.cols !== 2) return table
  return { ...table, columnTitles: ['Before (main)', 'After (branch)'] }
}
