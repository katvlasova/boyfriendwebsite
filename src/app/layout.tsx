import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boyfriend Website',
  description: 'A fun website about me',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 