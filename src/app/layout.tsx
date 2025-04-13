import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gay Evil Boyfriend',
  description: 'Find your perfect evil match',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  )
} 