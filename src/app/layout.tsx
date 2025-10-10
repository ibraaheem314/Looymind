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
  title: {
    default: 'Palanteer | Compétitions IA francophones au Sénégal',
    template: '%s | Palanteer'
  },
  description: 'Participez à des compétitions IA, apprenez via des tutoriels en français et publiez vos projets. Palanteer, la plateforme IA francophone du Sénégal.',
  keywords: ['IA Sénégal', 'Intelligence Artificielle', 'Compétitions Data Science', 'Machine Learning Afrique', 'Formation IA francophone', 'Kaggle Sénégal', 'Tutoriels IA français'],
  authors: [{ name: 'Palanteer' }],
  creator: 'Palanteer',
  publisher: 'Palanteer',
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'Palanteer | Plateforme IA francophone du Sénégal',
    description: 'Rejoignez la 1ère plateforme de compétitions IA en Afrique francophone. Apprenez, pratiquez, excellez.',
    url: 'https://palanteer.com',
    siteName: 'Palanteer',
    locale: 'fr_SN',
    type: 'website',
    images: ['/Logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palanteer | Compétitions IA au Sénégal',
    description: 'Participez à des compétitions IA et développez vos compétences en Data Science',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://palanteer.com',
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