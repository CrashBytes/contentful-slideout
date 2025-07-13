'use client'
import { memo, useState } from 'react'
import { 
  X, Monitor, Tablet, Smartphone, Settings, 
  ExternalLink, Copy, MoreHorizontal 
} from 'lucide-react'
import { usePreviewStore } from '@/stores/preview-store'
import { ContentfulEntry, EntryTypeDefinition, ViewMode } from '@/types'
import { formatters } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/**
 * Advanced Preview Header with Multi-Modal Controls
 * 
 * Design Excellence:
 * - Responsive viewport simulation controls
 * - Advanced configuration management interface
 * - Comprehensive keyboard navigation support
 * - Performance-optimized rendering with memoization
 * 
 * UX Principles:
 * - Progressive disclosure for advanced features
 * - Contextual action placement for workflow optimization
 * - Visual hierarchy through typography and spacing
 */
interface PreviewHeaderProps {
  entry: ContentfulEntry
  entryType: EntryTypeDefinition
  viewMode: ViewMode
}

export const PreviewHeader = memo(({ entry, entryType, viewMode }: PreviewHeaderProps) => {
  const { closePreview, setViewMode } = usePreviewStore()
  const [showSettings, setShowSettings] = useState(false)

  const viewModeButtons = [
    { 
      mode: 'desktop' as ViewMode, 
      icon: Monitor, 
      label: 'Desktop',
      dimensions: '1200×800'
    },
    { 
      mode: 'tablet' as ViewMode, 
      icon: Tablet, 
      label: 'Tablet',
      dimensions: '768×1024'
    },
    { 
      mode: 'mobile' as ViewMode, 
      icon: Smartphone, 
      label: 'Mobile',
      dimensions: '375×667'
    },
  ]

  const handleCopyPreviewUrl = async () => {
    const previewUrl = `${window.location.origin}/preview?id=${entry.sys.id}&type=${entry.sys.contentType.sys.id}&mode=${viewMode}`
    
    try {
      await navigator.clipboard.writeText(previewUrl)
      console.log('Preview URL copied to clipboard')
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleOpenInContentful = () => {
    const contentfulUrl = `https://app.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/entries/${entry.sys.id}`
    window.open(contentfulUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Entry Metadata with Enhanced Typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              <div className="min-w-0 flex-1">
                <h1 
                  id="preview-title"
                  className="text-lg font-semibold text-gray-900 truncate"
                  title={formatters.entryTitle(entry)}
                >
                  {formatters.entryTitle(entry)}
                </h1>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span>{entryType.name}</span>
                  <span>•</span>
                  <span>{formatters.date(entry.sys.updatedAt, 'MMM dd, HH:mm')}</span>
                  <span>•</span>
                  <span className="capitalize">{entry.sys.locale || 'en-US'}</span>
                </div>
              </div>
              
              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Advanced Control Interface */}
          <div className="flex items-center space-x-4">
            {/* Viewport Mode Selector with Enhanced UX */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {viewModeButtons.map(({ mode, icon: Icon, label, dimensions }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'group relative flex items-center px-3 py-2 text-sm rounded-md transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'hover:bg-white/50',
                    viewMode === mode
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  aria-pressed={viewMode === mode}
                  title={`${label} (${dimensions})`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{label}</span>
                  
                  {/* Enhanced Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {dimensions}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Controls with Progressive Disclosure */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPreviewUrl}
                className={cn(
                  'flex items-center px-3 py-2 text-sm text-gray-600',
                  'hover:text-gray-900 hover:bg-gray-100 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                title="Copy preview URL"
              >
                <Copy className="h-4 w-4" />
              </button>

              <button
                onClick={handleOpenInContentful}
                className={cn(
                  'flex items-center px-3 py-2 text-sm text-gray-600',
                  'hover:text-gray-900 hover:bg-gray-100 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                title="Open in Contentful"
              >
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm text-gray-600',
                  'hover:text-gray-900 hover:bg-gray-100 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  showSettings && 'bg-gray-100 text-gray-900'
                )}
                title="Preview settings"
              >
                <Settings className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              <button
                onClick={closePreview}
                className={cn(
                  'flex items-center px-3 py-2 text-sm text-gray-600',
                  'hover:text-gray-900 hover:bg-gray-100 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                title="Close preview (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure: Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Preview Configuration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show hidden fields</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Highlight editable fields</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Debug mode</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Performance metrics</span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
})

PreviewHeader.displayName = 'PreviewHeader'
