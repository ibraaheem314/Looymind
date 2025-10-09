import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

// Police principale - Space Grotesk (futuriste et technique)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Palanteer - Communauté IA du Sénégal',
  description: 'La première communauté hybride d\'Intelligence Artificielle du Sénégal. Apprenez, collaborez et participez à des défis IA.',
  keywords: 'IA, Intelligence Artificielle, Sénégal, Afrique, Machine Learning, Data Science, Communauté',
  authors: [{ name: 'Palanteer Team' }],
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'Palanteer - Communauté IA du Sénégal',
    description: 'Rejoignez la première communauté hybride d\'IA du Sénégal',
    type: 'website',
    locale: 'fr_FR',
    images: ['/Logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={spaceGrotesk.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}