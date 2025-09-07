'use client'

import { useYouTubeSearch } from '@/hooks/useYouTubeSearch'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import TrackList from './TrackList'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'

interface SearchResultsProps {
  query: string
  className?: string
}

export default function SearchResults({ query, className = "" }: SearchResultsProps) {
  const { results, isLoading, error, nextPageToken, loadMore, clear, convertToTrack } = useYouTubeSearch()
  const { setQueue, setCurrentTrack, play } = useMusicPlayer()

  const tracks = results.map(convertToTrack)

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    setQueue(tracks)
    setCurrentTrack(tracks[0])
    play()
  }

  const handleShuffle = () => {
    if (tracks.length === 0) return
    const shuffled = [...tracks].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCurrentTrack(shuffled[0])
    play()
  }

  const handleLoadMore = () => {
    loadMore()
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">Error en la búsqueda</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
        >
          Reintentar
        </Button>
      </div>
    )
  }

  if (isLoading && results.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <LoadingSpinner size="large" />
        <p className="text-gray-400 mt-4">Buscando "{query}"...</p>
      </div>
    )
  }

  if (!isLoading && results.length === 0 && query) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
        <p className="text-gray-400 mb-4">
          No encontramos ninguna canción para "{query}"
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Intenta con:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Términos de búsqueda diferentes</li>
            <li>Menos palabras específicas</li>
            <li>Nombres de artistas populares</li>
            <li>Títulos de canciones conocidas</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Results header */}
      {query && results.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Resultados para "{query}"
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
            </p>
            
            {tracks.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  onClick={handlePlayAll}
                  className="bg-green-500 hover:bg-green-600 text-black font-medium px-4"
                >
                  <span className="mr-2">▶️</span>
                  Reproducir todo
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShuffle}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
                >
                  <span className="mr-2">🔀</span>
                  Aleatorio
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Track list */}
      <TrackList
        tracks={tracks}
        showHeader={false}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
        emptyMessage="No hay resultados"
      />

      {/* Load more button */}
      {nextPageToken && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
          >
            Cargar más resultados
          </Button>
        </div>
      )}

      {/* Loading more indicator */}
      {isLoading && results.length > 0 && (
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
          <span className="ml-2 text-gray-400">Cargando más resultados...</span>
        </div>
      )}
    </div>
  )
}