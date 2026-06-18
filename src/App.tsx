import { useCallback, useMemo, useState } from 'react'
import { CompareGrid } from './components/CompareGrid'
import { ExportButton } from './components/ExportButton'
import type { Slot } from './types'
import './App.css'

function createSlot(label: string): Slot {
  return { id: crypto.randomUUID(), label, imageUrl: null, imageFile: null }
}

function App() {
  const [slots, setSlots] = useState<Slot[]>([
    createSlot('Screen 1'),
    createSlot('Screen 2'),
  ])

  const hasAnyImage = useMemo(() => slots.some((s) => s.imageUrl !== null), [slots])

  const handleLabelChange = useCallback((id: string, label: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)))
  }, [])

  const handleImageSet = useCallback((id: string, file: File) => {
    const url = URL.createObjectURL(file)
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        if (s.imageUrl) URL.revokeObjectURL(s.imageUrl)
        return { ...s, imageUrl: url, imageFile: file }
      })
    )
  }, [])

  const handleImageClear = useCallback((id: string) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        if (s.imageUrl) URL.revokeObjectURL(s.imageUrl)
        return { ...s, imageUrl: null, imageFile: null }
      })
    )
  }, [])

  const handleRemove = useCallback((id: string) => {
    setSlots((prev) => {
      if (prev.length <= 1) return prev
      const slot = prev.find((s) => s.id === id)
      if (slot?.imageUrl) URL.revokeObjectURL(slot.imageUrl)
      return prev.filter((s) => s.id !== id)
    })
  }, [])

  const handleAddSlot = useCallback(() => {
    setSlots((prev) => [...prev, createSlot(`Screen ${prev.length + 1}`)])
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <h1>Screen Compare</h1>
        <p>Compare screenshots side by side with custom labels. Export to PDF.</p>
      </header>

      <div className="app__toolbar">
        <button type="button" className="add-slot-btn" onClick={handleAddSlot}>
          + Add slot
        </button>
        <ExportButton slots={slots} disabled={!hasAnyImage} />
      </div>

      <CompareGrid
        slots={slots}
        onLabelChange={handleLabelChange}
        onImageSet={handleImageSet}
        onImageClear={handleImageClear}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default App
