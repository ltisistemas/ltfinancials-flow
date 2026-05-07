import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/hooks/use-app'
import { cn } from "@/lib/utils"
import { Inter, Geist } from 'next/font/google'

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

export const metadata: Metadata = {
  title: 'LTFinancials Flow',
  description: 'Intelligent financial flow management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark font-sans", "font-sans", geist.variable)}>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
