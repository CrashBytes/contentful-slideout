import { useEffect, ReactNode } from 'react'
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
  useEffect(() => {
    if (!config.spaceId || !config.previewAccessToken) {
      console.warn('Live updates require valid Contentful credentials')
      return
    }

    LivePreviewSystem.initialize({
      locale: 'en-US',
      enableInspectorMode: false,
      enableLiveUpdates: config.enableRealTimeUpdates !== false,
      debugMode: false,
      targetOrigin: 'https://app.contentful.com',
    })

    return () => {
      // cleanup handled by singleton
    }
  }, [
    config.spaceId,
    config.previewAccessToken,
    config.environment,
    config.enableRealTimeUpdates,
  ])
}

/**
 * Provider component for live updates functionality
 * Wraps children with live preview capabilities
 */
export function LiveUpdatesProvider({
  children,
  config,
}: LiveUpdatesProviderProps) {
  useLiveUpdates(config)

  return children
}
