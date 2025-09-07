'use client'

import { useEffect } from 'react'
import Sidebar from './Sidebar'
import MusicPlayer from '@/components/player/MusicPlayer'
import { initializeStorage } from '@/lib/storage'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  useEffect(() => {
    // Initialize storage with default data on first load
    initializeStorage()
  }, [])

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <main className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Music player - fixed at bottom */}
      <div className="h-24 border-t border-gray-800 bg-gray-900">
        <MusicPlayer />
      </div>
    </div>
  )
}