'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Playlist, Track } from '@/types/music'

interface PlaylistContextType {
  playlists: Playlist[]
  favorites: Track[]
  recentlyPlayed: Track[]
  createPlaylist: (name: string, description?: string) => Playlist
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
  deletePlaylist: (id: string) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  addToFavorites: (track: Track) => void
  removeFromFavorites: (trackId: string) => void
  addToRecentlyPlayed: (track: Track) => void
  isInFavorites: (trackId: string) => boolean
  getPlaylistById: (id: string) => Playlist | undefined
}

const PlaylistContext = createContext<PlaylistContextType | null>(null)

const STORAGE_KEYS = {
  PLAYLISTS: 'spotify-clone-playlists',
  FAVORITES: 'spotify-clone-favorites',
  RECENTLY_PLAYED: 'spotify-clone-recent'
}

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [favorites, setFavorites] = useState<Track[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedPlaylists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS)
      const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
      const savedRecent = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED)

      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists))
      }
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
      if (savedRecent) {
        setRecentlyPlayed(JSON.parse(savedRecent))
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists))
    } catch (error) {
      console.error('Error saving playlists to localStorage:', error)
    }
  }, [playlists])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }, [favorites])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed))
    } catch (error) {
      console.error('Error saving recently played to localStorage:', error)
    }
  }, [recentlyPlayed])

  const createPlaylist = useCallback((name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      tracks: [],
      coverImage: `https://placehold.co/300x300?text=${encodeURIComponent(name.replace(/\s+/g, '+'))}}+Playlist+Cover+Modern+Dark+Theme`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setPlaylists(prev => [...prev, newPlaylist])
    return newPlaylist
  }, [])

  const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === id 
        ? { ...playlist, ...updates, updatedAt: new Date() }
        : playlist
    ))
  }, [])

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id))
  }, [])

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if track already exists
        const trackExists = playlist.tracks.some(t => t.id === track.id)
        if (trackExists) return playlist

        return {
          ...playlist,
          tracks: [...playlist.tracks, track],
          updatedAt: new Date()
        }
      }
      return playlist
    }))
  }, [])

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(track => track.id !== trackId),
          updatedAt: new Date()
        }
      }
      return playlist
    }))
  }, [])

  const addToFavorites = useCallback((track: Track) => {
    setFavorites(prev => {
      const trackExists = prev.some(t => t.id === track.id)
      if (trackExists) return prev
      return [track, ...prev]
    })
  }, [])

  const removeFromFavorites = useCallback((trackId: string) => {
    setFavorites(prev => prev.filter(track => track.id !== trackId))
  }, [])

  const addToRecentlyPlayed = useCallback((track: Track) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists to move to top
      const filtered = prev.filter(t => t.id !== track.id)
      // Keep only last 50 tracks
      const newRecent = [track, ...filtered].slice(0, 50)
      return newRecent
    })
  }, [])

  const isInFavorites = useCallback((trackId: string) => {
    return favorites.some(track => track.id === trackId)
  }, [favorites])

  const getPlaylistById = useCallback((id: string) => {
    return playlists.find(playlist => playlist.id === id)
  }, [playlists])

  const contextValue: PlaylistContextType = {
    playlists,
    favorites,
    recentlyPlayed,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyPlayed,
    isInFavorites,
    getPlaylistById
  }

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist debe ser usado dentro de PlaylistProvider')
  }
  return context
}