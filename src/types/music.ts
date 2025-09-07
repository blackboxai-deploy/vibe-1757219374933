export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  thumbnail: string
  youtubeId: string
  audioUrl?: string
  addedAt: Date
}

export interface Playlist {
  id: string
  name: string
  description?: string
  tracks: Track[]
  coverImage: string
  createdAt: Date
  updatedAt: Date
}

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  shuffle: boolean
  repeat: 'none' | 'track' | 'playlist'
  queue: Track[]
  currentIndex: number
}

export interface SearchFilters {
  type: 'all' | 'track' | 'playlist' | 'artist'
  duration?: 'short' | 'medium' | 'long'
  uploadDate?: 'hour' | 'today' | 'week' | 'month' | 'year'
}

export interface AudioControls {
  play: () => void
  pause: () => void
  stop: () => void
  skipNext: () => void
  skipPrevious: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}