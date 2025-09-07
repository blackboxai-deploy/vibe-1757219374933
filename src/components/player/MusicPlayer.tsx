'use client'

import { useEffect } from 'react'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { usePlaylist } from '@/contexts/PlaylistContext'
import PlayerControls from './PlayerControls'
import VolumeControl from './VolumeControl'
import ProgressBar from './ProgressBar'
import { formatDuration } from '@/lib/audio-utils'
import Image from 'next/image'

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    play,
    pause,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat
  } = useMusicPlayer()

  const { addToRecentlyPlayed, isInFavorites, addToFavorites, removeFromFavorites } = usePlaylist()

  // Add currently playing track to recently played
  useEffect(() => {
    if (currentTrack && isPlaying) {
      const timer = setTimeout(() => {
        addToRecentlyPlayed(currentTrack)
      }, 30000) // Add after 30 seconds of playing

      return () => clearTimeout(timer)
    }
  }, [currentTrack, isPlaying, addToRecentlyPlayed])

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleFavoriteToggle = () => {
    if (!currentTrack) return

    if (isInFavorites(currentTrack.id)) {
      removeFromFavorites(currentTrack.id)
    } else {
      addToFavorites(currentTrack)
    }
  }

  if (!currentTrack) {
    return (
      <div className="h-24 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm">Selecciona una canción para comenzar</p>
          <p className="text-xs mt-1">Tu música aparecerá aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center px-4">
      {/* Track Info */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="w-14 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0">
          <Image
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://placehold.co/56x56?text=No+Image'
            }}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="text-white text-sm font-medium truncate">
            {currentTrack.title}
          </h4>
          <p className="text-gray-400 text-xs truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          className="text-gray-400 hover:text-white transition-colors p-1"
          title={isInFavorites(currentTrack.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <span className={`text-lg ${isInFavorites(currentTrack.id) ? 'text-green-500' : ''}`}>
            {isInFavorites(currentTrack.id) ? '💚' : '🤍'}
          </span>
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
        <PlayerControls
          isPlaying={isPlaying}
          shuffle={shuffle}
          repeat={repeat}
          onPlayPause={handlePlayPause}
          onSkipNext={skipNext}
          onSkipPrevious={skipPrevious}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
        />
        
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatDuration(currentTime)}
          </span>
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
          <span className="text-xs text-gray-400 w-10">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center justify-end flex-1">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />
      </div>
    </div>
  )
}