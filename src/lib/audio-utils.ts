/**
 * Audio utility functions for the music player
 */

export interface AudioFormat {
  url: string
  quality: 'low' | 'medium' | 'high'
  format: 'mp4' | 'webm' | 'mp3'
  size?: number
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parse YouTube duration format (PT4M13S) to seconds
 */
export function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const [, hours = '0', minutes = '0', seconds = '0'] = match
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
}

/**
 * Get percentage of current time vs total duration
 */
export function getProgressPercentage(currentTime: number, duration: number): number {
  if (!duration || duration === 0) return 0
  return Math.min(100, (currentTime / duration) * 100)
}

/**
 * Convert percentage to time position
 */
export function percentageToTime(percentage: number, duration: number): number {
  return (percentage / 100) * duration
}

/**
 * Validate if audio format is supported by the browser
 */
export function isAudioFormatSupported(format: string): boolean {
  const audio = document.createElement('audio')
  return audio.canPlayType(format) !== ''
}

/**
 * Get supported audio formats ordered by preference
 */
export function getSupportedFormats(): string[] {
  const audio = document.createElement('audio')
  const formats = [
    'audio/mpeg',     // MP3
    'audio/mp4',      // MP4/AAC
    'audio/ogg',      // OGG Vorbis
    'audio/webm',     // WebM
    'audio/wav'       // WAV
  ]
  
  return formats.filter(format => audio.canPlayType(format) !== '')
}

/**
 * Extract audio URL from YouTube video (placeholder - would need proper implementation)
 * In production, you'd use a service like youtube-dl or similar
 */
export async function extractAudioFromYouTube(youtubeId: string): Promise<AudioFormat[]> {
  // This is a placeholder implementation
  // In a real app, you'd need to use a proper YouTube audio extraction service
  // or implement server-side extraction with youtube-dl or similar tools
  
  console.warn('YouTube audio extraction not implemented - using demo URLs')
  
  // Return demo format for development
  return [
    {
      url: `https://www.youtube.com/watch?v=${youtubeId}`,
      quality: 'medium',
      format: 'mp4'
    }
  ]
}

/**
 * Crossfade between two audio elements
 */
export function crossfadeAudio(
  fromAudio: HTMLAudioElement,
  toAudio: HTMLAudioElement,
  duration: number = 3000
): Promise<void> {
  return new Promise((resolve) => {
    const steps = 50
    const stepDuration = duration / steps
    const volumeStep = 1 / steps
    
    let step = 0
    
    const interval = setInterval(() => {
      step++
      
      fromAudio.volume = Math.max(0, 1 - (step * volumeStep))
      toAudio.volume = Math.min(1, step * volumeStep)
      
      if (step >= steps) {
        clearInterval(interval)
        fromAudio.pause()
        fromAudio.currentTime = 0
        resolve()
      }
    }, stepDuration)
  })
}

/**
 * Apply audio effects (placeholder for future implementation)
 */
export interface AudioEffects {
  reverb?: number
  bass?: number
  treble?: number
  echo?: number
}

export function applyAudioEffects(audio: HTMLAudioElement, effects: AudioEffects): void {
  // Placeholder for audio effects implementation
  // Would use Web Audio API in a real implementation
  console.log('Audio effects not yet implemented:', effects)
}

/**
 * Analyze audio frequency data (placeholder for visualizer)
 */
export function getAudioFrequencyData(audio: HTMLAudioElement): Uint8Array | null {
  // Placeholder for audio analysis
  // Would use AudioContext and AnalyserNode in a real implementation
  return null
}

/**
 * Calculate optimal buffer size based on connection quality
 */
export function getOptimalBufferSize(): number {
  // Simple heuristic - in production you'd check connection speed
  return 5 // seconds
}

/**
 * Shuffle array in place (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate smart shuffle (avoids same artist back-to-back)
 */
export function smartShuffle<T extends { artist: string }>(tracks: T[]): T[] {
  if (tracks.length <= 2) return shuffleArray(tracks)
  
  const shuffled = [...tracks]
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    const testShuffle = shuffleArray(shuffled)
    let valid = true
    
    for (let i = 1; i < testShuffle.length; i++) {
      if (testShuffle[i].artist === testShuffle[i - 1].artist) {
        valid = false
        break
      }
    }
    
    if (valid) return testShuffle
    attempts++
  }
  
  // Fallback to regular shuffle if we can't find a valid smart shuffle
  return shuffleArray(shuffled)
}

/**
 * Volume curve for smooth volume transitions
 */
export function applyVolumeCurve(linearVolume: number): number {
  // Apply logarithmic curve for more natural volume perception
  return Math.pow(linearVolume, 2)
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}