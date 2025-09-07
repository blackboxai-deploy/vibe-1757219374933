import { NextRequest, NextResponse } from 'next/server'

// In a real app, you would use a database
// For demo purposes, we'll return success responses
// The actual data management happens on the client side with localStorage

export async function GET() {
  try {
    // In production, fetch from database
    // For now, return empty array as client handles storage
    return NextResponse.json({
      playlists: [],
      message: 'Playlists are managed client-side for demo'
    })
  } catch (error) {
    console.error('Playlists GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playlists' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Playlist name is required' }, 
        { status: 400 }
      )
    }

    // In production, save to database
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      description: description || '',
      tracks: [],
      coverImage: `https://placehold.co/300x300?text=${encodeURIComponent(name.replace(/\s+/g, '+'))}+Playlist+Cover`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      playlist: newPlaylist,
      message: 'Playlist created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Playlists POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create playlist' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, tracks } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Playlist ID is required' }, 
        { status: 400 }
      )
    }

    // In production, update in database
    const updatedPlaylist = {
      id,
      name,
      description,
      tracks,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      playlist: updatedPlaylist,
      message: 'Playlist updated successfully'
    })

  } catch (error) {
    console.error('Playlists PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update playlist' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Playlist ID is required' }, 
        { status: 400 }
      )
    }

    // In production, delete from database
    return NextResponse.json({
      message: 'Playlist deleted successfully'
    })

  } catch (error) {
    console.error('Playlists DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete playlist' }, 
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}