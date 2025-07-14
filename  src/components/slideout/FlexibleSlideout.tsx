// src/components/slideout/FlexibleSlideout.tsx
'use client'

import { Fragment, useEffect, useCallback } from 'react'
import { X, Eye, Edit, ExternalLink, Calendar, Clock, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { formatters } from '@/utils/formatters'

// Core interfaces for the flexible slideout
export interface SlideoutEntry {
  sys: {
    id: string
    contentType: { sys: { id: string } }
    createdAt: string
    updatedAt: string
  }
  fields: {
    [key: string]: any
  }
}

export interface SlideoutEntryType {
  id: string
  name: string
  contentTypeId: string
  previewComponent: React.ComponentType<SlideoutPreviewProps>
}

export interface SlideoutPreviewProps {
  data: SlideoutEntry
  props?: Record<string, any>
  viewMode?: ViewMode
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile'

export interface FlexibleSlideoutProps {
  isOpen: boolean
  onClose: () => void
  entryType: SlideoutEntryType
  data: SlideoutEntry
  props?: Record<string, any>
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  showHeader?: boolean
  showFooter?: boolean
  customActions?: React.ReactNode
}

export function FlexibleSlideout({
  isOpen,
  onClose,
  entryType,
  data,
  props = {},
  viewMode = 'desktop',
  onViewModeChange,
  showHeader = true,
  showFooter = true,
  customActions
}: FlexibleSlideoutProps) {
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode)
  const [showSettings, setShowSettings] = useState(false)

  // Close slideout on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setCurrentViewMode(mode)
    onViewModeChange?.(mode)
  }, [onViewModeChange])

  if (!isOpen) return null

  const entryTitle = data?.fields.title || data?.fields.name || `Entry ${data?.sys.id.slice(0, 8)}`
  
  const viewModeButtons = [
    { mode: 'desktop' as ViewMode, icon: Monitor, label: 'Desktop', width: 'max-w-6xl' },
    { mode: 'tablet' as ViewMode, icon: Tablet, label: 'Tablet', width: 'max-w-4xl' },
    { mode: 'mobile' as ViewMode, icon: Smartphone, label: 'Mobile', width: 'max-w-sm' }
  ]

  const currentConfig = viewModeButtons.find(config => config.mode === currentViewMode)

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Slideout Panel */}
      <div className={`fixed top-0 right-0 h-full w-full ${currentConfig?.width || 'max-w-4xl'} bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          {showHeader && (
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Content Preview</h2>
                    <p className="text-blue-100 text-sm">{entryType.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* View Mode Selector */}
                  <div className="flex items-center space-x-1 bg-white/20 rounded-lg p-1">
                    {viewModeButtons.map(({ mode, icon: Icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => handleViewModeChange(mode)}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          currentViewMode === mode
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                        title={label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>

                  {/* Custom Actions */}
                  {customActions}

                  {/* Default Actions */}
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Entry Title */}
              <h1 className="text-2xl font-bold mb-2">{String(entryTitle)}</h1>
              
              {/* Entry Metadata */}
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {data?.sys.updatedAt && formatters.timeAgo(data.sys.updatedAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {data?.sys.createdAt && formatters.date(data.sys.createdAt, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {data ? (
              <div className="h-full">
                {/* Render the custom preview component */}
                <entryType.previewComponent 
                  data={data}
                  props={props}
                  viewMode={currentViewMode}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Content Selected</h3>
                  <p className="text-slate-600">
                    Select an entry to preview its content and metadata.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {showFooter && (
            <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Live Preview Active</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    View Source
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

// Helper hook for using the slideout
export function useSlideout() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<{
    entryType: SlideoutEntryType
    data: SlideoutEntry
    props?: Record<string, any>
  } | null>(null)

  const openSlideout = useCallback((
    entryType: SlideoutEntryType,
    data: SlideoutEntry,
    props?: Record<string, any>
  ) => {
    setCurrentEntry({ entryType, data, props })
    setIsOpen(true)
  }, [])

  const closeSlideout = useCallback(() => {
    setIsOpen(false)
    setCurrentEntry(null)
  }, [])

  return {
    isOpen,
    currentEntry,
    openSlideout,
    closeSlideout
  }
}