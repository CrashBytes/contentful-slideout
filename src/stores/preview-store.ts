import { create } from 'zustand'
import { subscribeWithSelector, persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { 
  PreviewState, 
  ContentfulEntry, 
  EntryTypeDefinition, 
  ViewMode,
  EntryConfiguration
} from '@/types'

/**
 * Enterprise State Management with Zustand
 * 
 * Architectural Patterns:
 * - Immer integration for immutable updates
 * - Selective persistence for user preferences
 * - DevTools integration for debugging
 * - Comprehensive error handling
 */
export const usePreviewStore = create<PreviewState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          isOpen: false,
          viewMode: 'desktop' as ViewMode,
          activeEntry: null,
          entryType: null,
          configurations: new Map(),

          openPreview: (entry: ContentfulEntry, type?: EntryTypeDefinition) => {
            set(state => {
              try {
                state.isOpen = true
                state.activeEntry = entry
                state.entryType = type || null

                if (!state.configurations.has(entry.sys.id)) {
                  const defaultConfig: EntryConfiguration = {
                    entryId: entry.sys.id,
                    showHiddenFields: false,
                    highlightFields: true,
                    debugMode: false,
                  }
                  state.configurations.set(entry.sys.id, defaultConfig)
                }

                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'preview_opened', {
                    content_type: entry.sys.contentType.sys.id,
                    entry_id: entry.sys.id,
                  })
                }
              } catch (error) {
                console.error('Failed to open preview:', error)
              }
            })
          },

          closePreview: () => {
            set(state => {
              const wasOpen = state.isOpen
              
              state.isOpen = false
              state.activeEntry = null
              state.entryType = null

              if (wasOpen && typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'preview_closed')
              }
            })
          },

          updateConfiguration: (entryId: string, config: Partial<EntryConfiguration>) => {
            set(state => {
              const existing = state.configurations.get(entryId) || { entryId }
              const updated = { ...existing, ...config, lastModified: new Date().toISOString() }
              state.configurations.set(entryId, updated)
            })
          },

          setViewMode: (mode: ViewMode) => {
            set(state => {
              const previousMode = state.viewMode
              state.viewMode = mode

              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'preview_view_mode_change', {
                  from_mode: previousMode,
                  to_mode: mode,
                })
              }
            })
          },
        })),
        {
          name: 'contentful-preview-store',
          partialize: (state) => ({
            viewMode: state.viewMode,
            configurations: Array.from(state.configurations.entries()),
          }),
          onRehydrateStorage: () => (state) => {
            if (state) {
              state.configurations = new Map(state.configurations as any)
            }
          },
        }
      ),
      { name: 'preview-store' }
    )
  )
)
