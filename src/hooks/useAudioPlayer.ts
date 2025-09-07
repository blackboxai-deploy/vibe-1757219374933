'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Track } from '@/types/music'

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  error: string | null
}

interface AudioPlayerControls {
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  loadTrack: (track: Track) => void
}

interface UseAudioPlayerReturn extends AudioPlayerState, AudioPlayerControls {
  audioRef: React.RefObject<HTMLAudioElement>
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isLoading: false,
    error: null
  })

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
    }

    const handleLoadedMetadata = () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration,
        isLoading: false 
      }))
    }

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }))
    }

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }))
    }

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
    }

    const handleError = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: false,
        error: 'Error al cargar el audio' 
      }))
    }

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false, error: null }))
    }

    const handleWaiting = () => {
      setState(prev => ({ ...prev, isLoading: true }))
    }

    const handleCanPlayThrough = () => {
      setState(prev => ({ ...prev, isLoading: false }))
    }

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    // Cleanup event listeners
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [])

  // Update audio volume when state changes
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = state.isMuted ? 0 : state.volume
    }
  }, [state.volume, state.isMuted])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'No se pudo reproducir el audio',
        isPlaying: false 
      }))
    }
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
    }
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio && !isNaN(time) && time >= 0 && time <= audio.duration) {
      audio.currentTime = time
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    setState(prev => ({ ...prev, volume: clampedVolume, isMuted: false }))
  }, [])

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }, [])

  const loadTrack = useCallback((track: Track) => {
    const audio = audioRef.current
    if (!audio) return

    setState(prev => ({ ...prev, error: null, currentTime: 0 }))
    
    // In a real implementation, you would get the actual audio URL
    // For now, we'll use a placeholder that would be replaced by actual YouTube audio
    if (track.audioUrl) {
      audio.src = track.audioUrl
    } else {
      // This would be replaced with proper YouTube to audio conversion
      audio.src = `https://www.youtube.com/watch?v=${track.youtubeId}`
    }
  }, [])

  return {
    ...state,
    audioRef,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    toggleMute,
    loadTrack
  }
}

// Utility function to format time
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Utility function to parse YouTube duration format (PT4M13S -> seconds)
export function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const [, hours = '0', minutes = '0', seconds = '0'] = match
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
}