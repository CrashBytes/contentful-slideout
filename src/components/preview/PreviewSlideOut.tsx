/**
 * ========================================
 * PreviewSlideout Component
 * src/components/preview/PreviewSlideout.tsx
 * ========================================
 */

'use client'

import { Fragment, useEffect } from 'react'
import { X, Eye, Edit, ExternalLink, Clock, User, Calendar } from 'lucide-react'
import { formatters } from '@/utils/formatters'

interface Entry {
  sys: {
    id: string
    contentType: { sys: { id: string } }
    createdAt: string
    updatedAt: string
  }
  fields: {
    title?: string
    name?: string
    description?: string
    content?: any
    [key: string]: any
  }
}

interface PreviewSlideoutProps {
  isOpen: boolean
  onClose: () => void
  entry: Entry | null
  mode?: 'preview' | 'edit'
}

export function PreviewSlideout({ isOpen, onClose, entry, mode = 'preview' }: PreviewSlideoutProps) {
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

  if (!isOpen) return null

  const entryTitle = entry?.fields.title || entry?.fields.name || `Entry ${entry?.sys.id.slice(0, 8)}`
  const entryDescription = entry?.fields.description || 'No description available'

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
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {mode === 'preview' ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <Edit className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {mode === 'preview' ? 'Content Preview' : 'Content Editor'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {entry?.sys.contentType.sys.id || 'Content Type'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
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
                {entry?.sys.updatedAt && formatters.timeAgo(entry.sys.updatedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {entry?.sys.createdAt && formatters.date(entry.sys.createdAt, 'MMM dd, yyyy')}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {entry ? (
              <div className="p-6">
                {/* Content Preview */}
                <div className="space-y-6">
                  {/* Description */}
                  {entryDescription && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                      <p className="text-slate-600 leading-relaxed">{String(entryDescription)}</p>
                    </div>
                  )}

                  {/* Fields Display */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Content Fields</h3>
                    <div className="space-y-4">
                      {Object.entries(entry.fields).map(([key, value]) => (
                        <div key={key} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-slate-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {typeof value}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            {typeof value === 'string' ? (
                              <p className="break-words">{value}</p>
                            ) : typeof value === 'object' && value !== null ? (
                              <pre className="text-xs bg-slate-50 p-3 rounded overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              <span className="text-slate-400">
                                {value?.toString() || 'No value'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">System Information</h3>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Entry ID:</span>
                        <span className="font-mono text-sm">{entry.sys.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Content Type:</span>
                        <span className="font-mono text-sm">{entry.sys.contentType.sys.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span className="text-sm">{formatters.datetime(entry.sys.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Updated:</span>
                        <span className="text-sm">{formatters.datetime(entry.sys.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
          <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Live Preview Active</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Edit in Contentful
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Publish Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

/**
 * ========================================
 * formatters utility (if not exists)
 * src/utils/formatters.ts
 * ========================================
 */

import { format, parseISO, formatDistanceToNow } from 'date-fns'

export const formatters = {
  date: (date: string, pattern: string = 'PPP'): string => {
    try {
      return format(parseISO(date), pattern)
    } catch {
      return 'Invalid date'
    }
  },
  
  datetime: (date: string): string => {
    try {
      return format(parseISO(date), 'MMM dd, yyyy \'at\' HH:mm')
    } catch {
      return 'Invalid date'
    }
  },
  
  timeAgo: (date: string): string => {
    try {
      return formatDistanceToNow(parseISO(date), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  },
}