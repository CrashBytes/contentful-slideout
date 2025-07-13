import { useEffect, ReactNode } from 'react'
import { usePreviewStore } from '@/stores/preview-store'
import { LivePreviewSystem } from '@/lib/preview/LivePreviewSystem'

interface LiveUpdatesConfig {
  spaceId: string
  previewAccessToken: string
  environment?: string
  enableRealTimeUpdates?: boolean
}

interface LiveUpdatesProviderProps {
  children: ReactNode
  config: LiveUpdatesConfig
}

/**
 * Custom hook for managing live content updates from Contentful
 * Provides real-time synchronization capabilities for preview content
 */
export function useLiveUpdates(config: LiveUpdatesConfig) {
  const { setPreviewData, setConnectionStatus } = usePreviewStore()

  useEffect(() => {
    if (!config.spaceId || !config.previewAccessToken) {
      console.warn('Live updates require valid Contentful credentials')
      return
    }

    const previewSystem = new LivePreviewSystem({
      spaceId: config.spaceId,
      previewAccessToken: config.previewAccessToken,
      environment: config.environment || 'master',
    })

    const initializeSystem = async () => {
      try {
        setConnectionStatus('connecting')
        
        await previewSystem.initialize()
        
        // Set up event listeners for content changes
        previewSystem.onContentChange((updatedEntry) => {
          setPreviewData(updatedEntry)
        })

        previewSystem.onConnectionStatusChange((status) => {
          setConnectionStatus(status)
        })

        setConnectionStatus('connected')
      } catch (error) {
        console.error('Failed to initialize live preview system:', error)
        setConnectionStatus('error')
      }
    }

    if (config.enableRealTimeUpdates !== false) {
      initializeSystem()
    }

    return () => {
      previewSystem.cleanup()
    }
  }, [
    config.spaceId,
    config.previewAccessToken,
    config.environment,
    config.enableRealTimeUpdates,
    setPreviewData,
    setConnectionStatus,
  ])
}

/**
 * Provider component for live updates functionality
 * Wraps children with live preview capabilities
 */
export function LiveUpdatesProvider({ children, config }: LiveUpdatesProviderProps) {
  useLiveUpdates(config)
  
  return children
}