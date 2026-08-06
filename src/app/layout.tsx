import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ruya Careers Fair 2026',
  description: 'AAAH Interactive Careers Fair Game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={montserrat.variable}>
      <body className="min-h-screen bg-aaah-gradient font-[var(--font-montserrat)] antialiased">
        {children}
      </body>
    </html>
  )
}
