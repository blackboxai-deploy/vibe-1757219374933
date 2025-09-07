'use client'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  message?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  className = "",
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-gray-600 border-t-white rounded-full animate-spin`}
        role="status"
        aria-label="Cargando"
      />
      {message && (
        <p className="text-gray-400 text-sm mt-2">{message}</p>
      )}
    </div>
  )
}