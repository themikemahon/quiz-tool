import type { Metadata } from 'next'
import { Agentation } from 'agentation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quiz',
  description: 'Interactive quiz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          {children}
          {process.env.NODE_ENV === 'development' && <Agentation />}
        </body>
    </html>
  )
}
