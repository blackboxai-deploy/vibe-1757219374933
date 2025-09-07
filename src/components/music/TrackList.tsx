'use client'

import { useMemo } from 'react'
import { Track } from '@/types/music'
import TrackItem from './TrackItem'
import { Button } from '@/components/ui/button'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'

interface TrackListProps {
  tracks: Track[]
  title?: string
  showHeader?: boolean
  showIndex?: boolean
  showArtist?: boolean
  showDuration?: boolean
  showAlbum?: boolean
  emptyMessage?: string
  onPlayAll?: () => void
  onShuffle?: () => void
  onAddToPlaylist?: (track: Track) => void
  className?: string
}

export default function TrackList({
  tracks,
  title,
  showHeader = true,
  showIndex = true,
  showArtist = true,
  showDuration = true,
  showAlbum = false,
  emptyMessage = "No hay canciones disponibles",
  onPlayAll,
  onShuffle,
  onAddToPlaylist,
  className = ""
}: TrackListProps) {
  const { currentTrack, setQueue, setCurrentTrack, play } = useMusicPlayer()

  const totalDuration = useMemo(() => {
    return tracks.reduce((total, track) => total + track.duration, 0)
  }, [tracks])

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours} h ${minutes} min`
    }
    return `${minutes} min`
  }

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    
    if (onPlayAll) {
      onPlayAll()
    } else {
      setQueue(tracks)
      setCurrentTrack(tracks[0])
      play()
    }
  }

  const handleShuffle = () => {
    if (tracks.length === 0) return
    
    if (onShuffle) {
      onShuffle()
    } else {
      // Simple shuffle
      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
      setQueue(shuffled)
      setCurrentTrack(shuffled[0])
      play()
    }
  }

  const handleTrackPlay = (track: Track) => {
    const trackIndex = tracks.findIndex(t => t.id === track.id)
    if (trackIndex !== -1) {
      setQueue(tracks)
      setCurrentTrack(track)
      play()
    }
  }

  if (tracks.length === 0) {
    return (
      <div className={`${className}`}>
        {showHeader && title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          </div>
        )}
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-lg mb-2">{emptyMessage}</p>
          <p className="text-sm">Busca música para comenzar a escuchar</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {tracks.length} canción{tracks.length !== 1 ? 'es' : ''} • {formatTotalDuration(totalDuration)}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handlePlayAll}
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-6"
              >
                <span className="mr-2">▶️</span>
                Reproducir
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShuffle}
                className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
              >
                <span className="mr-2">🔀</span>
                Aleatorio
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Column headers (for larger screens) */}
      {showHeader && (
        <div className="hidden md:flex items-center text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 mb-2 px-2">
          <div className="w-8">#</div>
          <div className="flex-1 ml-3">Título</div>
          {showAlbum && <div className="flex-1">Álbum</div>}
          {showDuration && <div className="w-16 text-right">Duración</div>}
        </div>
      )}

      {/* Track list */}
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            track={track}
            index={index}
            showIndex={showIndex}
            showArtist={showArtist}
            showDuration={showDuration}
            showAlbum={showAlbum}
            isActive={currentTrack?.id === track.id}
            onPlay={handleTrackPlay}
            onAddToPlaylist={onAddToPlaylist}
          />
        ))}
      </div>

      {/* Footer info */}
      {tracks.length > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          Mostrando {tracks.length} canciones
        </div>
      )}
    </div>
  )
}