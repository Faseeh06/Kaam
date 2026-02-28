import React from "react"
import type { Metadata } from 'next'
import { Host_Grotesk, Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { MockDataProvider } from "@/app/context/MockDataContext"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], variable: "--font-host-grotesk" });

export const metadata: Metadata = {
  title: 'Kaam | Multi-Society Task Management',
  description: 'Manage societies and teams with ease. Assign tasks, track progress, and organize everything in one unified platform.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body className={`${hostGrotesk.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MockDataProvider>
            {children}
            <Analytics />
          </MockDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
