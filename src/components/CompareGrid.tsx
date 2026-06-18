import type { Slot } from '../types'
import { SlotCard } from './SlotCard'

interface Props {
  slots: Slot[]
  onLabelChange: (id: string, label: string) => void
  onImageSet: (id: string, file: File) => void
  onImageClear: (id: string) => void
  onRemove: (id: string) => void
}

export function CompareGrid({ slots, onLabelChange, onImageSet, onImageClear, onRemove }: Props) {
  const manySlots = slots.length > 3

  return (
    <div className={`compare-grid${manySlots ? ' compare-grid--many' : ''}`}>
      {slots.map((slot) => (
        <SlotCard
          key={slot.id}
          slot={slot}
          canRemove={slots.length > 1}
          onLabelChange={onLabelChange}
          onImageSet={onImageSet}
          onImageClear={onImageClear}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
