export type CellImage = {
  file: File
  previewUrl: string
}

export type TableState = {
  rows: number
  cols: number
  columnTitles: string[]
  rowTitles: string[]
  cells: (CellImage | null)[][]
}

export const MAX_GRID = 8
