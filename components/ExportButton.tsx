'use client'
import { Download } from 'lucide-react'

export default function ExportButton({ targetId, filename }: { targetId: string; filename: string }) {
  const handleExport = async () => {
    try {
      // Dynamic import to keep bundle small
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const element = document.getElementById(targetId)
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: '#0A0E1A',
        scale: 2,
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = (canvas.height * pageWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
      pdf.save(`${filename}.pdf`)
    } catch (e) {
      console.error('Export error:', e)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-surface-600 hover:bg-surface-500 border border-surface-500 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
    >
      <Download size={15} />
      Exportar PDF
    </button>
  )
}
