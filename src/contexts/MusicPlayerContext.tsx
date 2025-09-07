'use client'

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react'
import { Track, PlayerState, AudioControls } from '@/types/music'

interface MusicPlayerContextType extends PlayerState, AudioControls {
  setCurrentTrack: (track: Track) => void
  addToQueue: (tracks: Track | Track[]) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  setQueue: (tracks: Track[]) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null)

type PlayerAction =
  | { type: 'SET_TRACK'; track: Track }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_CURRENT_TIME'; time: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'SET_QUEUE'; tracks: Track[] }
  | { type: 'ADD_TO_QUEUE'; tracks: Track | Track[] }
  | { type: 'REMOVE_FROM_QUEUE'; index: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  shuffle: false,
  repeat: 'none',
  queue: [],
  currentIndex: -1
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.track,
        currentTime: 0,
        isPlaying: false
      }
    
    case 'PLAY':
      return { ...state, isPlaying: true }
    
    case 'PAUSE':
      return { ...state, isPlaying: false }
    
    case 'STOP':
      return { 
        ...state, 
        isPlaying: false, 
        currentTime: 0 
      }
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time }
    
    case 'SET_DURATION':
      return { ...state, duration: action.duration }
    
    case 'SET_VOLUME':
      return { ...state, volume: action.volume, isMuted: false }
    
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted }
    
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle }
    
    case 'TOGGLE_REPEAT':
      const nextRepeat = state.repeat === 'none' ? 'playlist' : 
                        state.repeat === 'playlist' ? 'track' : 'none'
      return { ...state, repeat: nextRepeat }
    
    case 'SET_QUEUE':
      return { ...state, queue: action.tracks, currentIndex: 0 }
    
    case 'ADD_TO_QUEUE':
      const tracksToAdd = Array.isArray(action.tracks) ? action.tracks : [action.tracks]
      return { ...state, queue: [...state.queue, ...tracksToAdd] }
    
    case 'REMOVE_FROM_QUEUE':
      const newQueue = state.queue.filter((_, index) => index !== action.index)
      return { 
        ...state, 
        queue: newQueue,
        currentIndex: action.index <= state.currentIndex ? state.currentIndex - 1 : state.currentIndex
      }
    
    case 'CLEAR_QUEUE':
      return { ...state, queue: [], currentIndex: -1 }
    
    case 'NEXT_TRACK':
      if (state.queue.length === 0) return state
      let nextIndex = state.currentIndex + 1
      if (nextIndex >= state.queue.length) {
        nextIndex = state.repeat === 'playlist' ? 0 : state.currentIndex
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex] || null,
        currentTime: 0
      }
    
    case 'PREVIOUS_TRACK':
      if (state.queue.length === 0) return state
      let prevIndex = state.currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = state.repeat === 'playlist' ? state.queue.length - 1 : 0
      }
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex] || null,
        currentTime: 0
      }
    
    default:
      return state
  }
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Audio element effects
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => dispatch({ type: 'SET_CURRENT_TIME', time: audio.currentTime })
    const updateDuration = () => dispatch({ type: 'SET_DURATION', duration: audio.duration })
    const handleEnded = () => {
      if (state.repeat === 'track') {
        audio.currentTime = 0
        audio.play()
      } else {
        skipNext()
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [state.repeat])

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !state.currentTrack) return

    // Generate YouTube audio URL (simplified - in production use proper API)
    const audioUrl = `https://www.youtube.com/watch?v=${state.currentTrack.youtubeId}`
    audio.src = audioUrl
    audio.volume = state.isMuted ? 0 : state.volume
  }, [state.currentTrack, state.volume, state.isMuted])

  // Control functions
  const play = useCallback(() => {
    const audio = audioRef.current
    if (audio && state.currentTrack) {
      audio.play().catch(console.error)
      dispatch({ type: 'PLAY' })
    }
  }, [state.currentTrack])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      dispatch({ type: 'PAUSE' })
    }
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      dispatch({ type: 'STOP' })
    }
  }, [])

  const skipNext = useCallback(() => {
    dispatch({ type: 'NEXT_TRACK' })
  }, [])

  const skipPrevious = useCallback(() => {
    dispatch({ type: 'PREVIOUS_TRACK' })
  }, [])

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      dispatch({ type: 'SET_CURRENT_TIME', time })
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', volume })
  }, [])

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' })
  }, [])

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' })
  }, [])

  const toggleRepeat = useCallback(() => {
    dispatch({ type: 'TOGGLE_REPEAT' })
  }, [])

  const setCurrentTrack = useCallback((track: Track) => {
    dispatch({ type: 'SET_TRACK', track })
  }, [])

  const addToQueue = useCallback((tracks: Track | Track[]) => {
    dispatch({ type: 'ADD_TO_QUEUE', tracks })
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', index })
  }, [])

  const clearQueue = useCallback(() => {
    dispatch({ type: 'CLEAR_QUEUE' })
  }, [])

  const setQueue = useCallback((tracks: Track[]) => {
    dispatch({ type: 'SET_QUEUE', tracks })
  }, [])

  const contextValue: MusicPlayerContextType = {
    ...state,
    play,
    pause,
    stop,
    skipNext,
    skipPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setCurrentTrack,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setQueue
  }

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer debe ser usado dentro de MusicPlayerProvider')
  }
  return context
}