import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Glaubensquiz - Bund für Geistesfreiheit Erlangen',
  description: 'QR-Glaubensquiz mit sechs Fragen und digitaler Urkunde ab fünf richtigen Antworten.',
  generator: 'v0.app',
  icons: {
    icon: '/bfg-erlangen-favicon-32.png',
    apple: '/bfg-erlangen-favicon-300.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
