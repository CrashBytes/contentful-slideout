import { useState, useEffect, useCallback } from 'react'
import { ContentfulEntry } from '@/types'
import { LivePreviewSystem } from '@/lib/preview/LivePreviewSystem'

/**
 * Custom Hooks for Contentful Live Updates
 * 
 * Design Excellence:
 * - Automatic subscription management with cleanup
 * - Optimistic rendering for immediate feedback
 * - Performance optimization through selective updates
 * - Type-safe integration with live preview system
 */
export function useContentfulLiveUpdates(initialEntry: ContentfulEntry): ContentfulEntry {
  const [entry, setEntry] = useState<ContentfulEntry>(initialEntry)

  useEffect(() => {
    const livePreview = LivePreviewSystem.getInstance()
    
    if (!livePreview) {
      setEntry(initialEntry)
      return
    }

    const unsubscribe = livePreview.subscribe(initialEntry.sys.id, (updatedEntry) => {
      setEntry(updatedEntry)
    })

    livePreview.updateEntry(initialEntry.sys.id, initialEntry)

    return unsubscribe
  }, [initialEntry.sys.id, initialEntry.sys.updatedAt])

  useEffect(() => {
    setEntry(initialEntry)
    
    const livePreview = LivePreviewSystem.getInstance()
    if (livePreview) {
      livePreview.updateEntry(initialEntry.sys.id, initialEntry)
    }
  }, [initialEntry])

  return entry
}

export function useContentfulInspectorMode(options: {
  entryId: string
  fieldId?: string
  locale?: string
}): (fieldOverride?: { fieldId: string }) => React.HTMLAttributes<HTMLElement> {
  const getInspectorProps = useCallback((fieldOverride?: { fieldId: string }) => {
    const livePreview = LivePreviewSystem.getInstance()
    
    if (!livePreview) {
      return {}
    }

    return livePreview.getInspectorProps({
      entryId: options.entryId,
      fieldId: fieldOverride?.fieldId || options.fieldId || '',
      locale: options.locale
    })
  }, [options.entryId, options.fieldId, options.locale])

  return getInspectorProps
}

export function LivePreviewProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode
  config: {
    locale: string
    enableInspectorMode?: boolean
    enableLiveUpdates?: boolean
    debugMode?: boolean
  }
}) {
  useEffect(() => {
    const livePreview = LivePreviewSystem.initialize({
      locale: config.locale,
      enableInspectorMode: config.enableInspectorMode ?? true,
      enableLiveUpdates: config.enableLiveUpdates ?? true,
      debugMode: config.debugMode ?? false,
      targetOrigin: 'https://app.contentful.com'
    })

    return () => {
      if (process.env.NODE_ENV === 'development') {
        // Cleanup handled by system
      }
    }
  }, [config])

  return <>{children}</>
}
