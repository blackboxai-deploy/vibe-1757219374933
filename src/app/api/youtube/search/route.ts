import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI, demoMusicData } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' }, 
      { status: 400 }
    )
  }

  try {
    // Check if we have a valid YouTube API key
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY
    
    if (!apiKey || apiKey === 'demo-key') {
      // Use demo data if no API key
      const filteredDemo = demoMusicData.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      )
      
      return NextResponse.json({
        items: filteredDemo,
        pageInfo: {
          totalResults: filteredDemo.length,
          resultsPerPage: filteredDemo.length
        }
      })
    }

    // Use real YouTube API
    const youtube = new YouTubeAPI(apiKey)
    const searchParams = {
      q: query,
      maxResults: parseInt(request.nextUrl.searchParams.get('maxResults') || '20'),
      type: (request.nextUrl.searchParams.get('type') || 'video') as 'video',
      duration: request.nextUrl.searchParams.get('duration') as 'short' | 'medium' | 'long' | undefined,
      order: request.nextUrl.searchParams.get('order') as any,
      pageToken: request.nextUrl.searchParams.get('pageToken') || undefined
    }

    const searchResults = await youtube.searchVideos(searchParams)
    
    // Get video details for duration and other metadata
    const videoIds = searchResults.items.map(item => item.id.videoId)
    const videoDetails = await youtube.getVideoDetails(videoIds)
    
    // Process results
    const processedTracks = youtube.processSearchResults(searchResults, videoDetails)
    
    return NextResponse.json({
      items: processedTracks,
      nextPageToken: searchResults.nextPageToken,
      prevPageToken: searchResults.prevPageToken,
      pageInfo: searchResults.pageInfo
    })

  } catch (error) {
    console.error('YouTube search error:', error)
    
    // Fallback to demo data on error
    const filteredDemo = demoMusicData.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    )
    
    return NextResponse.json({
      items: filteredDemo,
      pageInfo: {
        totalResults: filteredDemo.length,
        resultsPerPage: filteredDemo.length
      }
    })
  }
}

// Handle CORS for frontend requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}