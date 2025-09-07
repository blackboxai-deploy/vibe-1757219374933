'use client'

import { useState, useCallback, useMemo } from 'react'
import { YouTubeSearchParams, ProcessedTrack } from '@/types/youtube'
import { Track } from '@/types/music'

interface SearchState {
  results: ProcessedTrack[]
  isLoading: boolean
  error: string | null
  nextPageToken?: string
  totalResults: number
}

interface UseYouTubeSearchReturn extends SearchState {
  search: (params: YouTubeSearchParams) => Promise<void>
  loadMore: () => Promise<void>
  clear: () => void
  convertToTrack: (processedTrack: ProcessedTrack) => Track
}

export function useYouTubeSearch(): UseYouTubeSearchReturn {
  const [state, setState] = useState<SearchState>({
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0
  })

  const [lastSearchParams, setLastSearchParams] = useState<YouTubeSearchParams | null>(null)

  const search = useCallback(async (params: YouTubeSearchParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    setLastSearchParams(params)

    try {
      const queryParams = new URLSearchParams({
        q: params.q,
        maxResults: (params.maxResults || 20).toString(),
        type: params.type || 'video',
        ...(params.duration && { duration: params.duration }),
        ...(params.order && { order: params.order }),
        ...(params.pageToken && { pageToken: params.pageToken })
      })

      const response = await fetch(`/api/youtube/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setState(prev => ({
        ...prev,
        results: params.pageToken ? [...prev.results, ...data.items] : data.items,
        isLoading: false,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults || 0
      }))

    } catch (error) {
      console.error('Search error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido en la búsqueda'
      }))
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!lastSearchParams || !state.nextPageToken || state.isLoading) {
      return
    }

    await search({
      ...lastSearchParams,
      pageToken: state.nextPageToken
    })
  }, [lastSearchParams, state.nextPageToken, state.isLoading, search])

  const clear = useCallback(() => {
    setState({
      results: [],
      isLoading: false,
      error: null,
      totalResults: 0
    })
    setLastSearchParams(null)
  }, [])

  const convertToTrack = useCallback((processedTrack: ProcessedTrack): Track => {
    return {
      id: processedTrack.id,
      title: processedTrack.title,
      artist: processedTrack.artist,
      duration: processedTrack.duration,
      thumbnail: processedTrack.thumbnail,
      youtubeId: processedTrack.youtubeId,
      addedAt: new Date()
    }
  }, [])

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    ...state,
    search,
    loadMore,
    clear,
    convertToTrack
  }), [state, search, loadMore, clear, convertToTrack])

  return returnValue
}

// Popular search suggestions
export const searchSuggestions = [
  'música relajante',
  'top hits 2024',
  'rock clásico',
  'música electrónica',
  'pop en español',
  'jazz instrumental',
  'música para estudiar',
  'reggaeton 2024',
  'música indie',
  'clásicos de los 80s',
  'hip hop',
  'música latina',
  'ambient music',
  'música de videojuegos',
  'folk acústico'
]

// Search history utilities
const SEARCH_HISTORY_KEY = 'spotify-clone-search-history'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return

    setHistory(prev => {
      const filtered = prev.filter(item => item !== query)
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('Error saving search history:', error)
      }
      
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query)
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('Error updating search history:', error)
      }
      return newHistory
    })
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  }
}