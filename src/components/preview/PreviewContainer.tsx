'use client'
import { Suspense } from 'react'
import { PreviewHeader } from './PreviewHeader'
import { usePreviewStore } from '@/stores/preview-store'
import { ContentfulEntry, EntryTypeDefinition, ViewMode } from '@/types'
import { cn } from '@/utils/cn'

interface PreviewContainerProps {
  entry: ContentfulEntry
  entryType: EntryTypeDefinition
  viewMode: ViewMode
}

export function PreviewContainer({
  entry,
  entryType,
  viewMode,
}: PreviewContainerProps) {
  const { configurations, updateConfiguration } = usePreviewStore()

  const configuration = configurations.get(entry.sys.id)
  const PreviewComponent = entryType.previewComponent

  const handleConfigUpdate = (updates: Partial<any>) => {
    updateConfiguration(entry.sys.id, updates)
  }

  return (
    <div className='flex h-full flex-col bg-gray-50'>
      <PreviewHeader entry={entry} entryType={entryType} viewMode={viewMode} />

      <div className='flex-1 overflow-hidden'>
        <Suspense
          fallback={<div className='animate-pulse p-4'>Loading...</div>}
        >
          <div
            className={cn(
              'h-full overflow-auto bg-white',
              'preview-viewport',
              `preview-${viewMode}`,
              configuration?.debugMode && 'debug-mode'
            )}
            data-contentful-entry-id={entry.sys.id}
          >
            <PreviewComponent
              entry={entry}
              configuration={configuration}
              viewMode={viewMode}
              onConfigUpdate={handleConfigUpdate}
            />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
