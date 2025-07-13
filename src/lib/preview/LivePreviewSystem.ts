import { ContentfulEntry } from '@/types'

/**
 * Self-Contained Live Preview System
 * 
 * Architectural Excellence:
 * - Direct PostMessage communication with Contentful editor
 * - Optimistic rendering for immediate user feedback
 * - Secure cross-origin communication patterns
 * - Event-driven architecture with cleanup management
 */
export interface LivePreviewConfig {
  locale: string
  enableInspectorMode: boolean
  enableLiveUpdates: boolean
  debugMode: boolean
  targetOrigin: string
}

export interface FieldUpdateEvent {
  entryId: string
  fieldId: string
  locale: string
  value: any
  timestamp: number
}

export class LivePreviewSystem {
  private static instance: LivePreviewSystem
  private config: LivePreviewConfig
  private subscribers = new Map<string, Set<(entry: ContentfulEntry) => void>>()
  private entryCache = new Map<string, ContentfulEntry>()
  private messageQueue: FieldUpdateEvent[] = []
  private isProcessing = false

  private constructor(config: LivePreviewConfig) {
    this.config = config
    this.initializeMessageHandling()
    this.setupInspectorMode()
  }

  static initialize(config: LivePreviewConfig): LivePreviewSystem {
    if (!this.instance) {
      this.instance = new LivePreviewSystem(config)
    }
    return this.instance
  }

  static getInstance(): LivePreviewSystem | null {
    return this.instance
  }

  subscribe(entryId: string, callback: (entry: ContentfulEntry) => void): () => void {
    if (!this.subscribers.has(entryId)) {
      this.subscribers.set(entryId, new Set())
    }
    
    this.subscribers.get(entryId)!.add(callback)
    
    const cachedEntry = this.entryCache.get(entryId)
    if (cachedEntry) {
      callback(cachedEntry)
    }

    return () => {
      const callbacks = this.subscribers.get(entryId)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(entryId)
        }
      }
    }
  }

  updateEntry(entryId: string, updatedEntry: ContentfulEntry): void {
    this.entryCache.set(entryId, updatedEntry)
    
    const callbacks = this.subscribers.get(entryId)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(updatedEntry)
        } catch (error) {
          console.error('Live preview callback error:', error)
        }
      })
    }
  }

  getInspectorProps(options: {
    entryId: string
    fieldId: string
    locale?: string
  }): React.HTMLAttributes<HTMLElement> {
    if (!this.config.enableInspectorMode) {
      return {}
    }

    return {
      'data-contentful-entry-id': options.entryId,
      'data-contentful-field-id': options.fieldId,
      'data-contentful-locale': options.locale || this.config.locale,
      'data-contentful-inspector': 'true',
      onClick: this.handleInspectorClick.bind(this, options),
      style: {
        cursor: 'pointer',
        outline: this.config.debugMode ? '1px dashed #3b82f6' : 'none',
      }
    }
  }

  private initializeMessageHandling(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('message', (event) => {
      if (event.origin !== this.config.targetOrigin) {
        return
      }

      try {
        const data = event.data
        
        if (data.type === 'CONTENTFUL_FIELD_UPDATE' && this.config.enableLiveUpdates) {
          this.queueFieldUpdate({
            entryId: data.entryId,
            fieldId: data.fieldId,
            locale: data.locale,
            value: data.value,
            timestamp: Date.now()
          })
        }
        
        if (data.type === 'CONTENTFUL_ENTRY_UPDATE') {
          this.updateEntry(data.entryId, data.entry)
        }

      } catch (error) {
        console.error('Message handling error:', error)
      }
    })

    this.sendMessage({
      type: 'PREVIEW_READY',
      config: {
        locale: this.config.locale,
        capabilities: {
          liveUpdates: this.config.enableLiveUpdates,
          inspectorMode: this.config.enableInspectorMode
        }
      }
    })
  }

  private setupInspectorMode(): void {
    if (!this.config.enableInspectorMode || typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = `
      [data-contentful-inspector="true"]:hover {
        outline: 2px dashed #3b82f6 !important;
        outline-offset: 2px;
      }
      
      [data-contentful-inspector="true"]:hover::after {
        content: "✏️ Click to edit";
        position: absolute;
        background: #3b82f6;
        color: white;
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
        z-index: 1000;
        pointer-events: none;
        transform: translateY(-100%);
      }
    `
    document.head.appendChild(style)
  }

  private handleInspectorClick(options: any, event: React.MouseEvent): void {
    if (!this.config.enableInspectorMode) return

    event.preventDefault()
    event.stopPropagation()

    this.sendMessage({
      type: 'OPEN_FIELD_EDITOR',
      entryId: options.entryId,
      fieldId: options.fieldId,
      locale: options.locale || this.config.locale
    })
  }

  private queueFieldUpdate(event: FieldUpdateEvent): void {
    this.messageQueue.push(event)
    
    if (!this.isProcessing) {
      this.processMessageQueue()
    }
  }

  private async processMessageQueue(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) return

    this.isProcessing = true

    try {
      const updates = [...this.messageQueue]
      this.messageQueue = []

      const updatesByEntry = updates.reduce((acc, update) => {
        if (!acc[update.entryId]) {
          acc[update.entryId] = []
        }
        acc[update.entryId].push(update)
        return acc
      }, {} as Record<string, FieldUpdateEvent[]>)

      await Promise.all(
        Object.entries(updatesByEntry).map(([entryId, entryUpdates]) =>
          this.processBatchedUpdates(entryId, entryUpdates)
        )
      )

    } finally {
      this.isProcessing = false
      
      if (this.messageQueue.length > 0) {
        setTimeout(() => this.processMessageQueue(), 100)
      }
    }
  }

  private async processBatchedUpdates(entryId: string, updates: FieldUpdateEvent[]): Promise<void> {
    const currentEntry = this.entryCache.get(entryId)
    if (!currentEntry) return

    const updatedFields = { ...currentEntry.fields }
    updates.forEach(update => {
      updatedFields[update.fieldId] = update.value
    })

    const updatedEntry: ContentfulEntry = {
      ...currentEntry,
      fields: updatedFields,
      sys: {
        ...currentEntry.sys,
        updatedAt: new Date().toISOString(),
        revision: currentEntry.sys.revision + 1
      }
    }

    this.updateEntry(entryId, updatedEntry)
  }

  private sendMessage(message: any): void {
    if (typeof window === 'undefined') return

    try {
      window.parent.postMessage(message, this.config.targetOrigin)
    } catch (error) {
      console.error('Failed to send message to Contentful:', error)
    }
  }

  getMetrics() {
    return {
      subscribedEntries: this.subscribers.size,
      cachedEntries: this.entryCache.size,
      queuedUpdates: this.messageQueue.length,
      isProcessing: this.isProcessing
    }
  }
}

export function initializeLivePreview(config: LivePreviewConfig): LivePreviewSystem {
  return LivePreviewSystem.initialize(config)
}
