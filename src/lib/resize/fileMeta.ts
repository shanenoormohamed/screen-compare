import type { FileKind, InputFile } from './types';
import { ACCEPTED_TYPES } from './types';

export function detectKind(file: File): FileKind | null {
  if (file.type === 'image/gif') return 'gif';
  if (file.type === 'image/png' || file.type === 'image/jpeg') return 'still';
  if (
    file.type === 'video/quicktime' ||
    file.type === 'video/mp4' ||
    /\.mov$/i.test(file.name) ||
    /\.mp4$/i.test(file.name)
  ) {
    return 'video';
  }
  return null;
}

export function isAccepted(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  return /\.(png|jpe?g|gif|mov|mp4)$/i.test(file.name);
}

export function toInputFile(id: string, file: File, kind: FileKind): InputFile {
  return { id, file, kind };
}
