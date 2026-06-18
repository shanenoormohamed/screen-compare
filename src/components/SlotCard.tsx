import { useRef, useState } from 'react'
import type { Slot } from '../types'

interface Props {
  slot: Slot
  canRemove: boolean
  onLabelChange: (id: string, label: string) => void
  onImageSet: (id: string, file: File) => void
  onImageClear: (id: string) => void
  onRemove: (id: string) => void
}

export function SlotCard({ slot, canRemove, onLabelChange, onImageSet, onImageClear, onRemove }: Props) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) return
    onImageSet(slot.id, file)
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
    <div className="slot-card">
      <div className="slot-card__header">
        <input
          type="text"
          className="slot-card__label"
          value={slot.label}
          onChange={(e) => onLabelChange(slot.id, e.target.value)}
          placeholder="Label…"
        />
        <button
          type="button"
          className="slot-card__remove"
          onClick={() => onRemove(slot.id)}
          disabled={!canRemove}
          title="Remove slot"
        >
          ×
        </button>
      </div>

      {slot.imageUrl ? (
        <div className="slot-card__preview">
          <img src={slot.imageUrl} alt={slot.label || 'Screenshot'} />
          <div className="slot-card__preview-actions">
            <button type="button" className="slot-card__replace" onClick={handleClick}>
              Replace
            </button>
            <button type="button" className="slot-card__clear" onClick={() => onImageClear(slot.id)}>
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
          <p className="drop-zone__hint">Drop image here or click to upload</p>
          <p className="drop-zone__hint">PNG, JPG supported</p>
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
