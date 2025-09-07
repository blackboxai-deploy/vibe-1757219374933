'use client'

import { useState, useRef, MouseEvent } from 'react'
import { Button } from '@/components/ui/button'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
}

export default function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute
}: VolumeControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const volumeSliderRef = useRef<HTMLDivElement>(null)

  const displayVolume = isMuted ? 0 : volume
  const volumePercentage = displayVolume * 100

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇'
    if (volume < 0.3) return '🔈'
    if (volume < 0.7) return '🔉'
    return '🔊'
  }

  const handleSliderMouseDown = (e: MouseEvent) => {
    if (!volumeSliderRef.current) return

    setIsDragging(true)
    updateVolumeFromPosition(e)
  }

  const handleSliderMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    updateVolumeFromPosition(e)
  }

  const handleSliderMouseUp = () => {
    setIsDragging(false)
  }

  const updateVolumeFromPosition = (e: MouseEvent) => {
    if (!volumeSliderRef.current) return

    const rect = volumeSliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const newVolume = Math.max(0, Math.min(1, x / width))
    
    onVolumeChange(newVolume)
  }

  return (
    <div 
      className="flex items-center space-x-2 relative"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => {
        if (!isDragging) {
          setShowVolumeSlider(false)
        }
      }}
    >
      {/* Volume icon button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleMute}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800"
        title={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        <span className="text-lg">{getVolumeIcon()}</span>
      </Button>

      {/* Volume slider */}
      <div className={`transition-all duration-200 ${showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div
          ref={volumeSliderRef}
          className="relative h-1 bg-gray-600 rounded-full cursor-pointer group"
          onMouseDown={handleSliderMouseDown}
          onMouseMove={handleSliderMouseMove}
          onMouseUp={handleSliderMouseUp}
          onMouseLeave={() => {
            setIsDragging(false)
            if (!showVolumeSlider) {
              setShowVolumeSlider(false)
            }
          }}
        >
          {/* Volume track */}
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-150"
            style={{ width: `${volumePercentage}%` }}
          />
          
          {/* Volume handle */}
          <div
            className={`absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 transition-opacity duration-150 ${
              isDragging || volumePercentage > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{ left: `calc(${volumePercentage}% - 6px)` }}
          />
        </div>
      </div>

      {/* Volume percentage display */}
      {showVolumeSlider && (
        <span className="text-xs text-gray-400 w-8">
          {Math.round(volumePercentage)}
        </span>
      )}
    </div>
  )
}