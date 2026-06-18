import { useRef, useState } from 'react'
import type { Cell } from '../types'

interface Props {
  cell: Cell
  onImageSet: (file: File) => void
  onImageClear: () => void
}

export function CellCard({ cell, onImageSet, onImageClear }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) return
    onImageSet(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  function handleClick() {
    fileInputRef.current?.click()
  }

  return (
    <div className="cell-card">
      {cell.imageUrl ? (
        <div className="cell-card__preview">
          <img src={cell.imageUrl} alt="Screenshot" />
          <div className="cell-card__preview-actions">
            <button type="button" className="cell-card__replace" onClick={handleClick}>
              Replace
            </button>
            <button type="button" className="cell-card__clear" onClick={onImageClear}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`drop-zone${dragOver ? ' drop-zone--drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          <span className="drop-zone__icon">🖼</span>
          <p className="drop-zone__hint">Drop or click to upload</p>
          <p className="drop-zone__hint">PNG · JPG</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
