'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SearchBar from '@/components/common/SearchBar'
import TrackList from '@/components/music/TrackList'
import { usePlaylist } from '@/contexts/PlaylistContext'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { demoMusicData, musicCategories } from '@/lib/youtube-api'
import { Track } from '@/types/music'

export default function HomePage() {
  const router = useRouter()
  const { favorites, recentlyPlayed, playlists } = usePlaylist()
  const { setQueue, setCurrentTrack, play } = useMusicPlayer()
  const [featuredTracks] = useState<Track[]>(() => 
    demoMusicData.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      thumbnail: track.thumbnail,
      youtubeId: track.youtubeId,
      addedAt: new Date()
    }))
  )

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleCategoryClick = (category: typeof musicCategories[0]) => {
    router.push(`/search?q=${encodeURIComponent(category.query)}`)
  }

  const handleQuickPlay = (tracks: Track[]) => {
    if (tracks.length === 0) return
    setQueue(tracks)
    setCurrentTrack(tracks[0])
    play()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {getGreeting()}
        </h1>
        <p className="text-gray-400">
          ¿Qué te gustaría escuchar hoy?
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Busca canciones, artistas o álbumes"
          className="max-w-md"
        />
      </div>

      {/* Quick Access Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Favorites */}
          <Card 
            className="bg-gradient-to-br from-purple-700 to-purple-900 border-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push('/liked')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-purple-500 rounded flex items-center justify-center">
                  <span className="text-white text-2xl">💜</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Canciones que te gustan</h3>
                  <p className="text-purple-200 text-sm">
                    {favorites.length} canción{favorites.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Played */}
          <Card 
            className="bg-gradient-to-br from-green-700 to-green-900 border-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push('/recent')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-2xl">🕒</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Reproducidas recientemente</h3>
                  <p className="text-green-200 text-sm">
                    {recentlyPlayed.length} canción{recentlyPlayed.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Playlist */}
          {playlists.length > 0 && (
            <Card 
              className="bg-gradient-to-br from-blue-700 to-blue-900 border-0 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => router.push(`/playlist/${playlists[0].id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-500 rounded flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: playlists[0].coverImage ? `url(${playlists[0].coverImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!playlists[0].coverImage && (
                      <span className="text-white text-2xl">♪</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold truncate">
                      {playlists[0].name}
                    </h3>
                    <p className="text-blue-200 text-sm">
                      {playlists[0].tracks.length} canción{playlists[0].tracks.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Music Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Explorar géneros</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {musicCategories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              onClick={() => handleCategoryClick(category)}
              className="h-auto p-4 border-gray-700 bg-gray-800/50 hover:bg-gray-700 hover:border-gray-600"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {category.id === 'trending' && '🔥'}
                  {category.id === 'pop' && '🎤'}
                  {category.id === 'rock' && '🎸'}
                  {category.id === 'electronic' && '🎧'}
                  {category.id === 'latin' && '💃'}
                  {category.id === 'indie' && '🌟'}
                </div>
                <h3 className="text-white font-medium text-sm">{category.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{category.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Music */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Música destacada</h2>
          <Button
            variant="outline"
            onClick={() => handleQuickPlay(featuredTracks)}
            className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
          >
            <span className="mr-2">▶️</span>
            Reproducir todo
          </Button>
        </div>
        <TrackList
          tracks={featuredTracks.slice(0, 6)}
          showHeader={false}
          onPlayAll={() => handleQuickPlay(featuredTracks)}
          onShuffle={() => {
            const shuffled = [...featuredTracks].sort(() => Math.random() - 0.5)
            handleQuickPlay(shuffled)
          }}
        />
      </div>

      {/* Recently Played Preview */}
      {recentlyPlayed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Reproducidas recientemente</h2>
            <Button
              variant="ghost"
              onClick={() => router.push('/recent')}
              className="text-gray-400 hover:text-white"
            >
              Ver todo
            </Button>
          </div>
          <TrackList
            tracks={recentlyPlayed.slice(0, 5)}
            showHeader={false}
            onPlayAll={() => handleQuickPlay(recentlyPlayed)}
          />
        </div>
      )}

      {/* Made for You Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Hecho para ti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
            <CardContent className="p-4">
              <div 
                className="w-full h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded mb-3 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(https://placehold.co/200x200?text=Daily+Mix+1+Personalized+Music+Collection)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <span className="text-white text-4xl">🎵</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Daily Mix 1</h3>
              <p className="text-gray-400 text-sm">Tu música favorita y más</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
            <CardContent className="p-4">
              <div 
                className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-3 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(https://placehold.co/200x200?text=Discover+Weekly+New+Music+Discovery)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <span className="text-white text-4xl">✨</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Discover Weekly</h3>
              <p className="text-gray-400 text-sm">Nueva música para ti</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
            <CardContent className="p-4">
              <div 
                className="w-full h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded mb-3 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(https://placehold.co/200x200?text=Release+Radar+Latest+Releases)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <span className="text-white text-4xl">📡</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Release Radar</h3>
              <p className="text-gray-400 text-sm">Últimos lanzamientos</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
            <CardContent className="p-4">
              <div 
                className="w-full h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded mb-3 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(https://placehold.co/200x200?text=Chill+Mix+Relaxing+Music+Playlist)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <span className="text-white text-4xl">😌</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Chill Mix</h3>
              <p className="text-gray-400 text-sm">Música relajante</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}