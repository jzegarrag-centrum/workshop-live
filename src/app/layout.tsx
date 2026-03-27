import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Workshop Live — People Intelligence System',
  description: 'Taller de cocreación CENTRUM PUCP × Smart Centrum',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-centrum-off">{children}</body>
    </html>
  )
}
