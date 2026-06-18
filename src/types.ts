import type { FileKind } from './lib/resize/types';

export type CellImage = {
  file: File;
  previewUrl: string;
  alt: string;
  kind: FileKind;
};

export type TableState = {
  rows: number;
  cols: number;
  columnTitles: string[];
  rowTitles: string[];
  cells: (CellImage | null)[][];
};

export const MAX_GRID = 8;
