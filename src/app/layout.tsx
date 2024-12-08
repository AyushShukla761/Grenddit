import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Provider'


export const metadata = {
  title: 'Grenddit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({subsets: ['latin']})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn('bg-white text-slate-900 antialiased light',inter.className)}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <Providers>
        {/* @ts-expect-error server component */}
          <Navbar />
        
        <div className='container max-w-7xl mx-auto h-full pt-12'>
          {children}
          </div>

          </Providers>
        </body>
    </html>
  )
}