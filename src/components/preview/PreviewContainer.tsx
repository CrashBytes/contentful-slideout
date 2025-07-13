'use client'
import { Suspense } from 'react'
import { useContentfulLiveUpdates } from '@/hooks/use-live-updates'
import { PreviewHeader } from './PreviewHeader'
import { PreviewFooter } from './PreviewFooter'
import { PreviewErrorBoundary } from './PreviewErrorBoundary'
import { PreviewSkeleton } from './PreviewSkeleton'
import { usePreviewStore } from '@/stores/preview-store'
import { ContentfulEntry, EntryTypeDefinition, ViewMode } from '@/types'
import { cn } from '@/utils/cn'

/**
 * Preview Container Orchestration Layer
 * 
 * Architectural Responsibilities:
 * - Live update integration with optimistic rendering
 * - Error boundary isolation for component failures
 * - Performance optimization through Suspense boundaries
 * - Configuration management with real-time updates
 */
interface PreviewContainerProps {
  entry: ContentfulEntry
  entryType: EntryTypeDefinition
  viewMode: ViewMode
}

export function PreviewContainer({ entry, entryType, viewMode }: PreviewContainerProps) {
  const liveEntry = useContentfulLiveUpdates(entry)
  const { configurations, updateConfiguration } = usePreviewStore()
  
  const configuration = configurations.get(entry.sys.id)
  const PreviewComponent = entryType.previewComponent

  const handleConfigUpdate = (updates: Partial<any>) => {
    updateConfiguration(entry.sys.id, updates)
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <PreviewHeader 
        entry={liveEntry}
        entryType={entryType}
        viewMode={viewMode}
      />
      
      <div className="flex-1 overflow-hidden">
        <PreviewErrorBoundary entry={liveEntry}>
          <Suspense fallback={<PreviewSkeleton viewMode={viewMode} />}>
            <div
              className={cn(
                'h-full overflow-auto bg-white',
                'preview-viewport',
                `preview-${viewMode}`,
                configuration?.debugMode && 'debug-mode'
              )}
              data-contentful-entry-id={liveEntry.sys.id}
            >
              <PreviewComponent
                entry={liveEntry}
                configuration={configuration}
                viewMode={viewMode}
                onConfigUpdate={handleConfigUpdate}
              />
            </div>
          </Suspense>
        </PreviewErrorBoundary>
      </div>
      
      <PreviewFooter 
        entry={liveEntry}
        configuration={configuration}
        onConfigUpdate={handleConfigUpdate}
      />
    </div>
  )
}
