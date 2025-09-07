'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchHistory, searchSuggestions } from '@/hooks/useYouTubeSearch'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export default function SearchBar({
  onSearch,
  placeholder = "¿Qué quieres escuchar?",
  autoFocus = false,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const { history, addToHistory } = useSearchHistory()

  // Combine history and popular suggestions
  const allSuggestions = [
    ...history.slice(0, 5),
    ...searchSuggestions.filter(s => !history.includes(s)).slice(0, 10)
  ]

  // Filter suggestions based on current query
  const filteredSuggestions = query.trim() 
    ? allSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
    : allSuggestions.slice(0, 8)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (searchQuery: string = query) => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    onSearch(trimmedQuery)
    addToHistory(trimmedQuery)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0 || true) // Always show suggestions when focused
    setSelectedSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          handleSubmit(filteredSuggestions[selectedSuggestionIndex])
          setQuery(filteredSuggestions[selectedSuggestionIndex])
        } else {
          handleSubmit()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSubmit(suggestion)
  }

  // Auto-focus selected suggestion
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionRefs.current[selectedSuggestionIndex]) {
      suggestionRefs.current[selectedSuggestionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [selectedSuggestionIndex])

  return (
    <div className={`relative ${className}`}>
      {/* Search input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => setShowSuggestions(false), 150)
          }}
          placeholder={placeholder}
          className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12 focus:border-white focus:ring-1 focus:ring-white"
        />
        
        {/* Search icon/button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleSubmit()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 h-8 w-8"
        >
          <span className="text-lg">🔍</span>
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => {
            const isFromHistory = history.includes(suggestion)
            return (
              <button
                key={suggestion}
                ref={el => suggestionRefs.current[index] = el}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                  selectedSuggestionIndex === index ? 'bg-gray-700' : ''
                }`}
              >
                <span className="text-gray-400">
                  {isFromHistory ? '🕒' : '🔍'}
                </span>
                <span className="text-white flex-1">{suggestion}</span>
                {isFromHistory && (
                  <span className="text-xs text-gray-500">Reciente</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Search hint */}
      {!query && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 text-xs text-gray-500">
          <p>Busca canciones, artistas o álbumes</p>
        </div>
      )}
    </div>
  )
}