'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import SearchResults from '@/components/music/SearchResults'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useYouTubeSearch, searchSuggestions } from '@/hooks/useYouTubeSearch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const { search, clear } = useYouTubeSearch()

  useEffect(() => {
    if (initialQuery) {
      setCurrentQuery(initialQuery)
      search({
        q: initialQuery,
        maxResults: 20,
        type: 'video'
      })
    }
  }, [initialQuery, search])

  const handleSearch = (query: string) => {
    setCurrentQuery(query)
    if (query.trim()) {
      search({
        q: query,
        maxResults: 20,
        type: 'video'
      })
    } else {
      clear()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion)
  }

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Buscar</h1>
        
        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="¿Qué quieres escuchar?"
          autoFocus={!initialQuery}
          className="max-w-2xl"
        />
      </div>

      {/* Search Results or Browse Categories */}
      {currentQuery ? (
        <SearchResults query={currentQuery} />
      ) : (
        <div>
          {/* Browse Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Explorar todo</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Pop */}
              <Card 
                className="bg-gradient-to-br from-pink-500 to-rose-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('pop music hits')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Pop</h3>
                  <div className="text-4xl">🎤</div>
                </CardContent>
              </Card>

              {/* Rock */}
              <Card 
                className="bg-gradient-to-br from-red-600 to-orange-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('rock music classics')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Rock</h3>
                  <div className="text-4xl">🎸</div>
                </CardContent>
              </Card>

              {/* Hip-Hop */}
              <Card 
                className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('hip hop rap music')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Hip-Hop</h3>
                  <div className="text-4xl">🎤</div>
                </CardContent>
              </Card>

              {/* Electronic */}
              <Card 
                className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('electronic music EDM')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Electronic</h3>
                  <div className="text-4xl">🎧</div>
                </CardContent>
              </Card>

              {/* Jazz */}
              <Card 
                className="bg-gradient-to-br from-amber-600 to-yellow-700 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('jazz music instrumental')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Jazz</h3>
                  <div className="text-4xl">🎷</div>
                </CardContent>
              </Card>

              {/* Latin */}
              <Card 
                className="bg-gradient-to-br from-green-500 to-teal-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('música latina reggaeton')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Latino</h3>
                  <div className="text-4xl">💃</div>
                </CardContent>
              </Card>

              {/* R&B */}
              <Card 
                className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('R&B soul music')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">R&B</h3>
                  <div className="text-4xl">💜</div>
                </CardContent>
              </Card>

              {/* Country */}
              <Card 
                className="bg-gradient-to-br from-orange-600 to-red-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('country music')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Country</h3>
                  <div className="text-4xl">🤠</div>
                </CardContent>
              </Card>

              {/* Indie */}
              <Card 
                className="bg-gradient-to-br from-teal-500 to-cyan-600 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('indie music alternative')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Indie</h3>
                  <div className="text-4xl">🌟</div>
                </CardContent>
              </Card>

              {/* Classical */}
              <Card 
                className="bg-gradient-to-br from-indigo-600 to-purple-700 border-0 cursor-pointer hover:scale-105 transition-transform aspect-square"
                onClick={() => handleSuggestionClick('classical music orchestra')}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-white font-bold text-lg">Clásica</h3>
                  <div className="text-4xl">🎼</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Búsquedas populares</h2>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.slice(0, 12).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-white"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Consejos de búsqueda</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Encuentra exactamente lo que buscas</h4>
                <ul className="space-y-1">
                  <li>• Usa comillas para búsquedas exactas: "nombre de la canción"</li>
                  <li>• Combina artista y canción: "artista - título"</li>
                  <li>• Busca por género: "jazz instrumental"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Descubre nueva música</h4>
                <ul className="space-y-1">
                  <li>• Explora por década: "música de los 80s"</li>
                  <li>• Busca por estado de ánimo: "música relajante"</li>
                  <li>• Descubre covers: "cover acústico"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-6 pb-24">
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="large" message="Cargando búsqueda..." />
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}