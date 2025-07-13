import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/stores/query-client'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Contentful Preview System',
    default: 'Contentful Preview System',
  },
  description: 'Enterprise-grade content management with real-time preview capabilities and live synchronization.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.ctfassets.net" />
        <link rel="dns-prefetch" href="//cdn.contentful.com" />
        <link rel="dns-prefetch" href="//preview.contentful.com" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`
        ${inter.className}
        min-h-screen
        bg-gradient-to-br from-slate-50 to-slate-100
        text-slate-900
        antialiased
        selection:bg-blue-100 selection:text-blue-900
      `}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        
        <QueryProvider>
          <div id="main-content">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}