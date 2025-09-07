'use client'

import { Button } from '@/components/ui/button'

interface PlayerControlsProps {
  isPlaying: boolean
  shuffle: boolean
  repeat: 'none' | 'track' | 'playlist'
  onPlayPause: () => void
  onSkipNext: () => void
  onSkipPrevious: () => void
  onToggleShuffle: () => void
  onToggleRepeat: () => void
}

export default function PlayerControls({
  isPlaying,
  shuffle,
  repeat,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onToggleShuffle,
  onToggleRepeat
}: PlayerControlsProps) {
  
  const getRepeatIcon = () => {
    switch (repeat) {
      case 'track':
        return '🔂'
      case 'playlist':
        return '🔁'
      default:
        return '🔁'
    }
  }

  const getRepeatTitle = () => {
    switch (repeat) {
      case 'track':
        return 'Repetir canción actual'
      case 'playlist':
        return 'Repetir playlist'
      default:
        return 'Sin repetición'
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Shuffle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleShuffle}
        className={`p-2 hover:bg-gray-800 ${shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
        title={shuffle ? 'Desactivar aleatorio' : 'Activar aleatorio'}
      >
        <span className="text-lg">🔀</span>
      </Button>

      {/* Previous */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSkipPrevious}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800"
        title="Canción anterior"
      >
        <span className="text-xl">⏮️</span>
      </Button>

      {/* Play/Pause */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPlayPause}
        className="p-2 bg-white hover:bg-gray-200 rounded-full text-black hover:scale-105 transition-transform"
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        <span className="text-2xl">
          {isPlaying ? '⏸️' : '▶️'}
        </span>
      </Button>

      {/* Next */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSkipNext}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800"
        title="Siguiente canción"
      >
        <span className="text-xl">⏭️</span>
      </Button>

      {/* Repeat */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleRepeat}
        className={`p-2 hover:bg-gray-800 ${repeat !== 'none' ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
        title={getRepeatTitle()}
      >
        <span className="text-lg">{getRepeatIcon()}</span>
        {repeat === 'track' && (
          <span className="text-xs ml-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        )}
      </Button>
    </div>
  )
}