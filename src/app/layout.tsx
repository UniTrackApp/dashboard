import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { type Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { NextAuthSessionProvider } from '~/components/SessionProvider'
import { TailwindIndicator } from '~/components/tailwind-indicator'
import { Toaster } from '~/components/ui/toaster'
import { TRPCReactProvider } from './trpc/react'

import { ThemeProvider } from '@/components/theme-provider'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import '~/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'UniTrack',
  description: 'Welcome to UniTrack',
  icons: { icon: '/favicon.ico' },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NextAuthSessionProvider session={session}>
          <TRPCReactProvider headers={headers()}>
            <Theme>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <main className="min-h-screen">
                  {children}
                  <SpeedInsights />
                  <Analytics />
                  <Toaster />
                  <TailwindIndicator />
                </main>
              </ThemeProvider>
            </Theme>
          </TRPCReactProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
