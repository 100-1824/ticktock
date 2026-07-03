import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ticktock',
  description: 'Timesheet management app by tentwenty',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
