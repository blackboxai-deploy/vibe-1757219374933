import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'
import { PlaylistProvider } from '@/contexts/PlaylistContext'
import MainLayout from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone - Tu Música Sin Límites',
  description: 'Reproductor de música moderno con integración YouTube. Sin anuncios, con todas las funciones.',
  keywords: 'música, reproductor, spotify, youtube, sin anuncios, streaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        <MusicPlayerProvider>
          <PlaylistProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </PlaylistProvider>
        </MusicPlayerProvider>
      </body>
    </html>
  )
}