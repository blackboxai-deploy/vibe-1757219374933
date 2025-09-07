'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { usePlaylist } from '@/contexts/PlaylistContext'
import { Track } from '@/types/music'
import { formatDuration } from '@/lib/audio-utils'

interface TrackItemProps {
  track: Track
  index?: number
  showIndex?: boolean
  showArtist?: boolean
  showDuration?: boolean
  showAlbum?: boolean
  isActive?: boolean
  onPlay?: (track: Track) => void
  onAddToPlaylist?: (track: Track) => void
  className?: string
}

export default function TrackItem({
  track,
  index,
  showIndex = true,
  showArtist = true,
  showDuration = true,
  showAlbum = false,
  isActive = false,
  onPlay,
  onAddToPlaylist,
  className = ""
}: TrackItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { currentTrack, isPlaying, setCurrentTrack, play, pause } = useMusicPlayer()
  const { isInFavorites, addToFavorites, removeFromFavorites } = usePlaylist()

  const isCurrentTrack = currentTrack?.id === track.id
  const isTrackPlaying = isCurrentTrack && isPlaying
  const isFavorite = isInFavorites(track.id)

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(track)
    } else if (isCurrentTrack) {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    } else {
      setCurrentTrack(track)
      play()
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite) {
      removeFromFavorites(track.id)
    } else {
      addToFavorites(track)
    }
  }

  const handleAddToPlaylistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToPlaylist) {
      onAddToPlaylist(track)
    }
  }

  return (
    <div
      className={`group flex items-center p-2 rounded-md transition-colors hover:bg-gray-800/50 cursor-pointer ${
        isActive || isCurrentTrack ? 'bg-gray-800/30' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      {/* Index / Play button */}
      <div className="w-8 flex items-center justify-center text-gray-400 text-sm">
        {isHovered || isCurrentTrack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handlePlayClick()
            }}
            className="p-1 h-6 w-6 hover:bg-transparent"
          >
            {isTrackPlaying ? (
              <span className="text-white">⏸️</span>
            ) : (
              <span className="text-white">▶️</span>
            )}
          </Button>
        ) : showIndex && index !== undefined ? (
          <span className={isCurrentTrack ? 'text-green-500' : ''}>{index + 1}</span>
        ) : (
          <span className="text-lg">♪</span>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 flex items-center space-x-3 min-w-0 ml-3">
        {/* Thumbnail */}
        <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
          <Image
            src={track.thumbnail}
            alt={track.title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://placehold.co/40x40?text=No+Image'
            }}
          />
        </div>

        {/* Title and artist */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
            {track.title}
          </h4>
          {showArtist && (
            <p className="text-sm text-gray-400 truncate">
              {track.artist}
            </p>
          )}
        </div>

        {/* Album (if enabled) */}
        {showAlbum && (
          <div className="flex-1 min-w-0 hidden md:block">
            <p className="text-sm text-gray-400 truncate">
              Album Name
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className="p-1 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <span className={`text-sm ${isFavorite ? 'text-green-500' : ''}`}>
            {isFavorite ? '💚' : '🤍'}
          </span>
        </Button>

        {/* Add to playlist button */}
        {onAddToPlaylist && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToPlaylistClick}
            className="p-1 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
            title="Agregar a playlist"
          >
            <span className="text-sm">➕</span>
          </Button>
        )}
      </div>

      {/* Duration */}
      {showDuration && (
        <div className="w-16 text-right">
          <span className="text-sm text-gray-400">
            {formatDuration(track.duration)}
          </span>
        </div>
      )}
    </div>
  )
}