import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Looymind - Communauté IA du Sénégal',
  description: 'La première communauté hybride d\'Intelligence Artificielle du Sénégal. Apprenez, collaborez et participez à des défis IA.',
  keywords: 'IA, Intelligence Artificielle, Sénégal, Afrique, Machine Learning, Data Science, Communauté',
  authors: [{ name: 'Looymind Team' }],
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'Looymind - Communauté IA du Sénégal',
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
      <body className={inter.className}>
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