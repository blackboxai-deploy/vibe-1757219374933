import { YouTubeSearchResponse, YouTubeVideo, ProcessedTrack } from '@/types/youtube'

// YouTube Data API configuration
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'demo-key'
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

export class YouTubeAPI {
  private apiKey: string

  constructor(apiKey: string = YOUTUBE_API_KEY) {
    this.apiKey = apiKey
  }

  async searchVideos(params: {
    q: string
    maxResults?: number
    pageToken?: string
    type?: 'video' | 'playlist' | 'channel'
    duration?: 'short' | 'medium' | 'long'
    order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'
  }): Promise<YouTubeSearchResponse> {
    const queryParams = new URLSearchParams({
      part: 'snippet',
      key: this.apiKey,
      q: params.q,
      type: params.type || 'video',
      maxResults: (params.maxResults || 20).toString(),
      videoCategoryId: '10', // Music category
      safeSearch: 'moderate',
      regionCode: 'US',
      relevanceLanguage: 'es',
      ...(params.pageToken && { pageToken: params.pageToken }),
      ...(params.duration && { videoDuration: params.duration }),
      ...(params.order && { order: params.order })
    })

    // Add music-specific filters
    if (params.type === 'video') {
      queryParams.append('videoEmbeddable', 'true')
      queryParams.append('videoSyndicated', 'true')
    }

    try {
      const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`YouTube API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(`YouTube API Error: ${data.error.message}`)
      }

      return data
    } catch (error) {
      console.error('YouTube API Error:', error)
      throw error
    }
  }

  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) return []

    const queryParams = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      key: this.apiKey,
      id: videoIds.join(',')
    })

    try {
      const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`YouTube API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(`YouTube API Error: ${data.error.message}`)
      }

      return data.items || []
    } catch (error) {
      console.error('YouTube API Error:', error)
      throw error
    }
  }

  processSearchResults(searchResponse: YouTubeSearchResponse, videoDetails?: YouTubeVideo[]): ProcessedTrack[] {
    return searchResponse.items.map(item => {
      const videoDetail = videoDetails?.find(detail => 
        detail.id === item.id.videoId || (typeof detail.id === 'object' && detail.id.videoId === item.id.videoId)
      )

      // Extract artist and title from video title
      const { artist, title } = this.parseVideoTitle(item.snippet.title)

      // Parse duration
      const duration = videoDetail?.contentDetails?.duration 
        ? this.parseYouTubeDuration(videoDetail.contentDetails.duration)
        : 0

      // Get best thumbnail
      const thumbnail = this.getBestThumbnail(item.snippet.thumbnails)

      return {
        id: `youtube-${item.id.videoId}`,
        title: title,
        artist: artist || item.snippet.channelTitle,
        duration: duration,
        thumbnail: thumbnail,
        youtubeId: item.id.videoId,
        description: item.snippet.description,
        viewCount: parseInt(videoDetail?.statistics?.viewCount || '0'),
        publishedAt: item.snippet.publishedAt
      }
    })
  }

  private parseVideoTitle(title: string): { artist: string; title: string } {
    // Common patterns for music videos
    const patterns = [
      /^(.+?)\s*[-–—]\s*(.+?)(?:\s*\(.*?\)|\s*\[.*?\])*$/,  // Artist - Title
      /^(.+?)\s*[:|]\s*(.+?)(?:\s*\(.*?\)|\s*\[.*?\])*$/,   // Artist : Title
      /^(.+?)\s*"(.+?)".*$/,                                  // Artist "Title"
      /^(.+?)\s*'(.+?)'.*$/,                                  // Artist 'Title'
    ]

    for (const pattern of patterns) {
      const match = title.match(pattern)
      if (match) {
        return {
          artist: match[1].trim(),
          title: match[2].trim()
        }
      }
    }

    // If no pattern matches, return the full title as both artist and title
    return {
      artist: '',
      title: title.trim()
    }
  }

  private getBestThumbnail(thumbnails: any): string {
    // Priority order: maxres > high > medium > default
    const priorities = ['maxres', 'high', 'medium', 'default']
    
    for (const priority of priorities) {
      if (thumbnails[priority]) {
        return thumbnails[priority].url
      }
    }

    return 'https://placehold.co/320x180?text=No+Image+Available'
  }

  private parseYouTubeDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT4M13S -> 253 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0

    const [, hours = '0', minutes = '0', seconds = '0'] = match
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
  }
}

// Demo data for when API key is not available
export const demoMusicData: ProcessedTrack[] = [
  {
    id: 'demo-1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: 355,
    thumbnail: 'https://placehold.co/320x180?text=Queen+Bohemian+Rhapsody+Classic+Rock+Album+Cover',
    youtubeId: 'fJ9rUzIMcZQ',
    description: 'The legendary rock opera by Queen',
    viewCount: 1900000000,
    publishedAt: '2008-08-01T00:00:00Z'
  },
  {
    id: 'demo-2',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    duration: 482,
    thumbnail: 'https://placehold.co/320x180?text=Led+Zeppelin+Stairway+To+Heaven+Rock+Classic',
    youtubeId: 'QkF3oxziUI4',
    description: 'One of the greatest rock songs of all time',
    viewCount: 800000000,
    publishedAt: '2007-10-15T00:00:00Z'
  },
  {
    id: 'demo-3',
    title: 'Hotel California',
    artist: 'Eagles',
    duration: 391,
    thumbnail: 'https://placehold.co/320x180?text=Eagles+Hotel+California+70s+Rock+Masterpiece',
    youtubeId: 'BciS5krYL80',
    description: 'The iconic song by The Eagles',
    viewCount: 650000000,
    publishedAt: '2009-06-16T00:00:00Z'
  },
  {
    id: 'demo-4',
    title: 'Imagine',
    artist: 'John Lennon',
    duration: 183,
    thumbnail: 'https://placehold.co/320x180?text=John+Lennon+Imagine+Peace+Song+Classic',
    youtubeId: 'YkgkThdzX-8',
    description: "John Lennon's message of peace and unity",
    viewCount: 450000000,
    publishedAt: '2010-01-08T00:00:00Z'
  },
  {
    id: 'demo-5',
    title: 'Sweet Child O Mine',
    artist: 'Guns N Roses',
    duration: 356,
    thumbnail: 'https://placehold.co/320x180?text=Guns+N+Roses+Sweet+Child+O+Mine+Rock+Guitar',
    youtubeId: '1w7OgIMMRc4',
    description: "Guns N' Roses classic rock anthem",
    viewCount: 1200000000,
    publishedAt: '2009-10-25T00:00:00Z'
  },
  {
    id: 'demo-6',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    duration: 294,
    thumbnail: 'https://placehold.co/320x180?text=Michael+Jackson+Billie+Jean+Pop+King+Dance',
    youtubeId: 'Zi_XLOBDo_Y',
    description: 'The King of Pop at his finest',
    viewCount: 750000000,
    publishedAt: '2009-10-02T00:00:00Z'
  }
]

// Trending and popular music categories
export const musicCategories = [
  {
    id: 'trending',
    name: 'Trending',
    query: 'música trending 2024',
    description: 'Lo más popular ahora'
  },
  {
    id: 'pop',
    name: 'Pop',
    query: 'pop music hits',
    description: 'Los mejores hits pop'
  },
  {
    id: 'rock',
    name: 'Rock',
    query: 'rock music classics',
    description: 'Rock clásico y moderno'
  },
  {
    id: 'electronic',
    name: 'Electronic',
    query: 'electronic music EDM',
    description: 'Música electrónica y EDM'
  },
  {
    id: 'latin',
    name: 'Latino',
    query: 'música latina reggaeton',
    description: 'Lo mejor de la música latina'
  },
  {
    id: 'indie',
    name: 'Indie',
    query: 'indie music alternative',
    description: 'Indie y música alternativa'
  }
]