import { useState } from 'react'
import { jsPDF } from 'jspdf'
import type { Slot } from '../types'

interface Props {
  slots: Slot[]
  disabled: boolean
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export function ExportButton({ slots, disabled }: Props) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    const filledSlots = slots.filter((s) => s.imageUrl !== null)
    if (filledSlots.length === 0) return

    setExporting(true)
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const marginTop = 48
      const marginSide = 24
      const titleHeight = 28
      const labelHeight = 20
      const gutterX = 12

      // Page title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(17, 24, 39)
      doc.text('Screen Compare', marginSide, marginTop)

      const contentTop = marginTop + titleHeight
      const contentHeight = pageHeight - contentTop - marginSide

      const slotCount = filledSlots.length
      const totalGutterWidth = gutterX * (slotCount - 1)
      const slotWidth = (pageWidth - marginSide * 2 - totalGutterWidth) / slotCount
      const imageAreaHeight = contentHeight - labelHeight - 8

      for (let i = 0; i < filledSlots.length; i++) {
        const slot = filledSlots[i]
        const x = marginSide + i * (slotWidth + gutterX)

        // Label
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(17, 24, 39)
        doc.text(slot.label || `Screen ${i + 1}`, x, contentTop + labelHeight - 4)

        if (!slot.imageUrl) continue

        try {
          const img = await loadImage(slot.imageUrl)
          const naturalW = img.naturalWidth
          const naturalH = img.naturalHeight

          // Fit image into slot bounds while preserving aspect ratio
          const scaleW = slotWidth / naturalW
          const scaleH = imageAreaHeight / naturalH
          const scale = Math.min(scaleW, scaleH)
          const drawW = naturalW * scale
          const drawH = naturalH * scale
          const drawX = x + (slotWidth - drawW) / 2
          const drawY = contentTop + labelHeight + 4

          const format = slot.imageFile?.type === 'image/png' ? 'PNG' : 'JPEG'
          doc.addImage(slot.imageUrl, format, drawX, drawY, drawW, drawH)
        } catch {
          // Draw placeholder box if image fails
          doc.setDrawColor(229, 231, 235)
          doc.setFillColor(249, 250, 251)
          doc.rect(x, contentTop + labelHeight + 4, slotWidth, imageAreaHeight, 'FD')
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(107, 114, 128)
          doc.text('Image unavailable', x + slotWidth / 2, contentTop + labelHeight + imageAreaHeight / 2, { align: 'center' })
        }
      }

      doc.save('screen-compare.pdf')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      className="export-btn"
      onClick={handleExport}
      disabled={disabled || exporting}
    >
      {exporting ? 'Exporting…' : 'Export PDF'}
    </button>
  )
}
