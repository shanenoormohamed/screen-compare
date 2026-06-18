export interface Cell {
  id: string
  imageUrl: string | null
  imageFile: File | null
}

export interface GridState {
  columnLabels: string[]
  rowLabels: string[]
  cells: Cell[][]  // cells[rowIndex][colIndex]
}
