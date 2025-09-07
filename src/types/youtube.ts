export interface YouTubeSearchResponse {
  items: YouTubeVideo[]
  nextPageToken?: string
  prevPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

export interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
      maxres?: YouTubeThumbnail
    }
    channelTitle: string
    publishedAt: string
    channelId: string
  }
  contentDetails?: {
    duration: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
  }
}

export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YouTubeSearchParams {
  q: string
  maxResults?: number
  pageToken?: string
  type?: 'video' | 'playlist' | 'channel'
  duration?: 'short' | 'medium' | 'long'
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'
}

export interface ProcessedTrack {
  id: string
  title: string
  artist: string
  duration: number
  thumbnail: string
  youtubeId: string
  description: string
  viewCount: number
  publishedAt: string
}