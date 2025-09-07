'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePlaylist } from '@/contexts/PlaylistContext'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const pathname = usePathname()
  const { playlists, createPlaylist } = usePlaylist()
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)

  const handleCreatePlaylist = () => {
    if (isCreatingPlaylist) return
    
    setIsCreatingPlaylist(true)
    const playlistName = `Mi Playlist #${playlists.length + 1}`
    createPlaylist(playlistName, 'Nueva playlist creada')
    setIsCreatingPlaylist(false)
  }

  const navigationItems = [
    {
      name: 'Inicio',
      href: '/',
      icon: '🏠',
      active: pathname === '/'
    },
    {
      name: 'Buscar',
      href: '/search',
      icon: '🔍',
      active: pathname.startsWith('/search')
    },
    {
      name: 'Tu Biblioteca',
      href: '/library',
      icon: '📚',
      active: pathname.startsWith('/library')
    }
  ]

  const libraryItems = [
    {
      name: 'Canciones que te gustan',
      href: '/liked',
      icon: '💜',
      active: pathname === '/liked'
    },
    {
      name: 'Reproducidas recientemente',
      href: '/recent',
      icon: '🕒',
      active: pathname === '/recent'
    }
  ]

  return (
    <div className="w-64 bg-black flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">♪</span>
          </div>
          <span className="text-white text-xl font-bold">Spotify Clone</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800',
                item.active && 'text-white bg-gray-800'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Library Section */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
            Tu Biblioteca
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreatePlaylist}
            disabled={isCreatingPlaylist}
            className="text-gray-400 hover:text-white p-1 h-auto"
            title="Crear playlist"
          >
            <span className="text-2xl">+</span>
          </Button>
        </div>

        {/* Library quick access */}
        <div className="space-y-1 mb-4">
          {libraryItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sm text-gray-400 hover:text-white hover:bg-gray-800',
                  item.active && 'text-white bg-gray-800'
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Playlists */}
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-sm text-gray-400 hover:text-white hover:bg-gray-800 truncate',
                    pathname === `/playlist/${playlist.id}` && 'text-white bg-gray-800'
                  )}
                >
                  <div className="flex items-center space-x-3 w-full min-w-0">
                    <div 
                      className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${playlist.coverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!playlist.coverImage && (
                        <span className="text-white text-xs">♪</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{playlist.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {playlist.tracks.length} canciones
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
            
            {playlists.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm mb-2">No tienes playlists aún</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCreatePlaylist}
                  disabled={isCreatingPlaylist}
                >
                  Crear tu primera playlist
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer info */}
      <div className="mt-auto p-4 text-xs text-gray-500">
        <div className="space-y-1">
          <div>Spotify Clone</div>
          <div>Música sin límites</div>
          <div className="pt-2 border-t border-gray-800">
            <a 
              href="#" 
              className="hover:text-gray-300 transition-colors"
            >
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}