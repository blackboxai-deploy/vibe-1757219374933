import { NextRequest, NextResponse } from 'next/server'
import { YouTubeAPI, demoMusicData } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('videoId')
  
  if (!videoId) {
    return NextResponse.json(
      { error: 'VideoId parameter is required' }, 
      { status: 400 }
    )
  }

  try {
    // Check for demo data first
    const demoTrack = demoMusicData.find(track => track.youtubeId === videoId)
    if (demoTrack) {
      return NextResponse.json(demoTrack)
    }

    // Try with real API if available
    const apiKey = 'demo-key' // We'll use demo for now
    
    if (apiKey === 'demo-key') {
      return NextResponse.json(
        { error: 'Track not found' }, 
        { status: 404 }
      )
    }

    const youtube = new YouTubeAPI(apiKey)
    const videoDetails = await youtube.getVideoDetails([videoId])
    
    if (videoDetails.length === 0) {
      return NextResponse.json(
        { error: 'Track not found' }, 
        { status: 404 }
      )
    }

    // Process the single track
    const searchResponse = {
      items: [{
        id: { videoId },
        snippet: videoDetails[0].snippet
      }]
    }
    
    const processedTracks = youtube.processSearchResults(searchResponse as any, videoDetails)
    
    if (processedTracks.length === 0) {
      return NextResponse.json(
        { error: 'Failed to process track' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(processedTracks[0])

  } catch (error) {
    console.error('Track fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

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