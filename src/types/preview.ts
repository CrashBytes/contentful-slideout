import { ContentfulEntry } from './contentful'

export type ViewMode = 'desktop' | 'tablet' | 'mobile'

export interface PreviewConfiguration {
  showHiddenFields?: boolean
  highlightFields?: boolean
  debugMode?: boolean
  customSettings?: Record<string, any>
}

export interface EntryConfiguration extends PreviewConfiguration {
  entryId: string
  version?: number
  lastModified?: string
}

export interface PreviewComponentProps<T = any> {
  entry: ContentfulEntry<T>
  configuration?: EntryConfiguration
  viewMode: ViewMode
  onConfigUpdate?: (config: Partial<EntryConfiguration>) => void
}

export interface EntryTypeDefinition<T = any> {
  id: string
  name: string
  contentTypeId: string
  previewComponent: React.ComponentType<PreviewComponentProps<T>>
  validator: (entry: ContentfulEntry) => entry is ContentfulEntry<T>
  configSchema: {
    type: 'object'
    properties: Record<string, any>
  }
  defaultConfiguration?: Partial<EntryConfiguration>
}

export interface PreviewState {
  isOpen: boolean
  viewMode: ViewMode
  activeEntry: ContentfulEntry | null
  entryType: EntryTypeDefinition | null
  configurations: Map<string, EntryConfiguration>
  
  openPreview: (entry: ContentfulEntry, type?: EntryTypeDefinition) => void
  closePreview: () => void
  updateConfiguration: (entryId: string, config: Partial<EntryConfiguration>) => void
  setViewMode: (mode: ViewMode) => void
}
