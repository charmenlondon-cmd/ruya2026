import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Image from 'next/image'

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
        <header className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-sm">
          <Image
            src="/logos/aaah-logo-white.png"
            alt="Abdulla Al Arif Holding"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
