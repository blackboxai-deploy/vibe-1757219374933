/**
 * Local storage utilities for persisting app data
 */

import { Playlist, Track } from '@/types/music'

export const STORAGE_KEYS = {
  PLAYLISTS: 'spotify-clone-playlists',
  FAVORITES: 'spotify-clone-favorites',
  RECENTLY_PLAYED: 'spotify-clone-recently-played',
  SEARCH_HISTORY: 'spotify-clone-search-history',
  PLAYER_SETTINGS: 'spotify-clone-player-settings',
  THEME: 'spotify-clone-theme',
  VOLUME: 'spotify-clone-volume'
} as const

export interface PlayerSettings {
  volume: number
  isMuted: boolean
  shuffle: boolean
  repeat: 'none' | 'track' | 'playlist'
  crossfade: boolean
  highQuality: boolean
}

const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  volume: 0.7,
  isMuted: false,
  shuffle: false,
  repeat: 'none',
  crossfade: false,
  highQuality: true
}

/**
 * Generic storage functions with error handling
 */
class Storage {
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : (defaultValue || null)
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue || null
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  static remove(key: string): boolean {
    if (typeof window === 'undefined') return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  }

  static clear(): boolean {
    if (typeof window === 'undefined') return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

/**
 * Playlist storage functions
 */
export class PlaylistStorage {
  static getAll(): Playlist[] {
    return Storage.get<Playlist[]>(STORAGE_KEYS.PLAYLISTS, []) || []
  }

  static save(playlists: Playlist[]): boolean {
    return Storage.set(STORAGE_KEYS.PLAYLISTS, playlists)
  }

  static add(playlist: Playlist): boolean {
    const playlists = this.getAll()
    const updated = [...playlists, playlist]
    return this.save(updated)
  }

  static update(playlistId: string, updates: Partial<Playlist>): boolean {
    const playlists = this.getAll()
    const updated = playlists.map(p => 
      p.id === playlistId ? { ...p, ...updates, updatedAt: new Date() } : p
    )
    return this.save(updated)
  }

  static remove(playlistId: string): boolean {
    const playlists = this.getAll()
    const updated = playlists.filter(p => p.id !== playlistId)
    return this.save(updated)
  }

  static findById(playlistId: string): Playlist | null {
    const playlists = this.getAll()
    return playlists.find(p => p.id === playlistId) || null
  }
}

/**
 * Favorites storage functions
 */
export class FavoritesStorage {
  static getAll(): Track[] {
    return Storage.get<Track[]>(STORAGE_KEYS.FAVORITES, []) || []
  }

  static save(favorites: Track[]): boolean {
    return Storage.set(STORAGE_KEYS.FAVORITES, favorites)
  }

  static add(track: Track): boolean {
    const favorites = this.getAll()
    const exists = favorites.some(f => f.id === track.id)
    if (exists) return true
    
    const updated = [track, ...favorites]
    return this.save(updated)
  }

  static remove(trackId: string): boolean {
    const favorites = this.getAll()
    const updated = favorites.filter(f => f.id !== trackId)
    return this.save(updated)
  }

  static toggle(track: Track): boolean {
    const favorites = this.getAll()
    const exists = favorites.some(f => f.id === track.id)
    
    if (exists) {
      return this.remove(track.id)
    } else {
      return this.add(track)
    }
  }

  static isFavorite(trackId: string): boolean {
    const favorites = this.getAll()
    return favorites.some(f => f.id === trackId)
  }
}

/**
 * Recently played storage functions
 */
export class RecentlyPlayedStorage {
  private static readonly MAX_ITEMS = 100

  static getAll(): Track[] {
    return Storage.get<Track[]>(STORAGE_KEYS.RECENTLY_PLAYED, []) || []
  }

  static save(tracks: Track[]): boolean {
    return Storage.set(STORAGE_KEYS.RECENTLY_PLAYED, tracks)
  }

  static add(track: Track): boolean {
    const recent = this.getAll()
    const filtered = recent.filter(r => r.id !== track.id)
    const updated = [track, ...filtered].slice(0, this.MAX_ITEMS)
    return this.save(updated)
  }

  static clear(): boolean {
    return this.save([])
  }
}

/**
 * Search history storage functions
 */
export class SearchHistoryStorage {
  private static readonly MAX_ITEMS = 20

  static getAll(): string[] {
    return Storage.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []) || []
  }

  static save(history: string[]): boolean {
    return Storage.set(STORAGE_KEYS.SEARCH_HISTORY, history)
  }

  static add(query: string): boolean {
    if (!query.trim()) return true

    const history = this.getAll()
    const filtered = history.filter(h => h !== query)
    const updated = [query, ...filtered].slice(0, this.MAX_ITEMS)
    return this.save(updated)
  }

  static remove(query: string): boolean {
    const history = this.getAll()
    const updated = history.filter(h => h !== query)
    return this.save(updated)
  }

  static clear(): boolean {
    return this.save([])
  }
}

/**
 * Player settings storage functions
 */
export class PlayerSettingsStorage {
  static get(): PlayerSettings {
    return Storage.get<PlayerSettings>(STORAGE_KEYS.PLAYER_SETTINGS, DEFAULT_PLAYER_SETTINGS) || DEFAULT_PLAYER_SETTINGS
  }

  static save(settings: PlayerSettings): boolean {
    return Storage.set(STORAGE_KEYS.PLAYER_SETTINGS, settings)
  }

  static update(updates: Partial<PlayerSettings>): boolean {
    const current = this.get()
    const updated = { ...current, ...updates }
    return this.save(updated)
  }

  static reset(): boolean {
    return this.save(DEFAULT_PLAYER_SETTINGS)
  }
}

/**
 * Theme storage functions
 */
export type Theme = 'light' | 'dark' | 'system'

export class ThemeStorage {
  static get(): Theme {
    return Storage.get<Theme>(STORAGE_KEYS.THEME, 'dark') || 'dark'
  }

  static save(theme: Theme): boolean {
    return Storage.set(STORAGE_KEYS.THEME, theme)
  }
}

/**
 * Export all for convenience
 */
export {
  Storage,
  PlaylistStorage as Playlists,
  FavoritesStorage as Favorites,
  RecentlyPlayedStorage as RecentlyPlayed,
  SearchHistoryStorage as SearchHistory,
  PlayerSettingsStorage as PlayerSettings,
  ThemeStorage as Theme
}

/**
 * Initialize storage with default data if empty
 */
export function initializeStorage(): void {
  // Create default playlists if none exist
  const playlists = PlaylistStorage.getAll()
  if (playlists.length === 0) {
    const defaultPlaylist: Playlist = {
      id: 'liked-songs',
      name: 'Canciones que te gustan',
      description: 'Tus canciones favoritas',
      tracks: [],
      coverImage: 'https://placehold.co/300x300?text=Liked+Songs+Heart+Love+Music+Collection',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    PlaylistStorage.add(defaultPlaylist)
  }

  // Initialize player settings if not exist
  const settings = PlayerSettingsStorage.get()
  if (!settings) {
    PlayerSettingsStorage.save(DEFAULT_PLAYER_SETTINGS)
  }
}

/**
 * Export/Import functions for backup
 */
export interface AppData {
  playlists: Playlist[]
  favorites: Track[]
  recentlyPlayed: Track[]
  searchHistory: string[]
  playerSettings: PlayerSettings
  theme: Theme
  exportDate: string
  version: string
}

export function exportAppData(): AppData {
  return {
    playlists: PlaylistStorage.getAll(),
    favorites: FavoritesStorage.getAll(),
    recentlyPlayed: RecentlyPlayedStorage.getAll(),
    searchHistory: SearchHistoryStorage.getAll(),
    playerSettings: PlayerSettingsStorage.get(),
    theme: ThemeStorage.get(),
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  }
}

export function importAppData(data: AppData): boolean {
  try {
    PlaylistStorage.save(data.playlists || [])
    FavoritesStorage.save(data.favorites || [])
    RecentlyPlayedStorage.save(data.recentlyPlayed || [])
    SearchHistoryStorage.save(data.searchHistory || [])
    PlayerSettingsStorage.save(data.playerSettings || DEFAULT_PLAYER_SETTINGS)
    ThemeStorage.save(data.theme || 'dark')
    return true
  } catch (error) {
    console.error('Error importing app data:', error)
    return false
  }
}