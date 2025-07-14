import React from 'react'

export interface SlideoutEntry {
  sys: {
    id: string
    contentType: { sys: { id: string } }
    createdAt: string
    updatedAt: string
  }
  fields: Record<string, any>
}

export interface SlideoutEntryType {
  id: string
  name: string
  contentTypeId: string
  previewComponent: React.ComponentType<any>
}

export interface FlexibleSlideoutProps {
  isOpen: boolean
  onClose: () => void
  entryType: SlideoutEntryType
  data: SlideoutEntry
  props?: Record<string, any>
  viewMode?: 'desktop' | 'tablet' | 'mobile'
}

export function FlexibleSlideout({
  isOpen,
  onClose,
  entryType,
  data,
  props = {},
  viewMode = 'desktop'
}: FlexibleSlideoutProps) {
  if (!isOpen) return null

  const PreviewComponent = entryType.previewComponent

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: viewMode === 'mobile' ? '100%' : viewMode === 'tablet' ? '768px' : '1024px',
      height: '100%',
      backgroundColor: 'white',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Content Preview</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>{entryType.name}</p>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        <PreviewComponent data={data} props={props} viewMode={viewMode} />
      </div>
    </div>
  )
}
