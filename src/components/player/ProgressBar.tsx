'use client'

import { useState, useRef, MouseEvent, TouchEvent } from 'react'
import { getProgressPercentage, percentageToTime } from '@/lib/audio-utils'

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export default function ProgressBar({
  currentTime,
  duration,
  onSeek
}: ProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const progress = isDragging ? dragProgress : getProgressPercentage(currentTime, duration)

  const getPositionFromEvent = (e: MouseEvent | TouchEvent): number => {
    if (!progressBarRef.current) return 0

    const rect = progressBarRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    const width = rect.width
    
    return Math.max(0, Math.min(100, (x / width) * 100))
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (!duration) return

    setIsDragging(true)
    const newProgress = getPositionFromEvent(e)
    setDragProgress(newProgress)
    
    const seekTime = percentageToTime(newProgress, duration)
    onSeek(seekTime)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !duration) return

    const newProgress = getPositionFromEvent(e)
    setDragProgress(newProgress)
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !duration) return

    const newProgress = getPositionFromEvent(e)
    const seekTime = percentageToTime(newProgress, duration)
    onSeek(seekTime)
    
    setIsDragging(false)
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (!duration) return

    setIsDragging(true)
    const newProgress = getPositionFromEvent(e)
    setDragProgress(newProgress)
    
    const seekTime = percentageToTime(newProgress, duration)
    onSeek(seekTime)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !duration) return

    e.preventDefault() // Prevent scrolling
    const newProgress = getPositionFromEvent(e)
    setDragProgress(newProgress)
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging || !duration) return

    const newProgress = dragProgress
    const seekTime = percentageToTime(newProgress, duration)
    onSeek(seekTime)
    
    setIsDragging(false)
  }

  return (
    <div className="flex-1 flex items-center">
      <div
        ref={progressBarRef}
        className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress track */}
        <div
          className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
        
        {/* Progress handle */}
        <div
          className={`absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 transition-opacity duration-150 ${
            isDragging || progress > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ left: `calc(${progress}% - 6px)` }}
        />
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-full group-hover:bg-gray-500 group-hover:bg-opacity-20 transition-colors duration-150" />
      </div>
    </div>
  )
}