import React from 'react'

interface SlideoutPreviewProps {
  data: any
  props?: Record<string, any>
  viewMode?: 'desktop' | 'tablet' | 'mobile'
}

export function BlogPostPreview({ data, props }: SlideoutPreviewProps) {
  const { fields } = data
  const { showReadTime, showTags } = props || {}

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {fields.title}
      </h1>
      {fields.excerpt && (
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
          {fields.excerpt}
        </p>
      )}
      {showReadTime && fields.readTime && (
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          {fields.readTime} min read
        </p>
      )}
      {showTags && fields.tags && (
        <div style={{ marginBottom: '1rem' }}>
          {fields.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              style={{
                display: 'inline-block',
                background: '#f0f0f0',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                marginRight: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '0.5rem' }}>
        <h3>Content Preview</h3>
        <p>{fields.content}</p>
      </div>
    </div>
  )
}

export function AuthorPreview({ data, props }: SlideoutPreviewProps) {
  const { fields } = data
  const { showSocialLinks } = props || {}

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {fields.name}
      </h1>
      {fields.bio && (
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          {fields.bio}
        </p>
      )}
      {showSocialLinks && fields.socialLinks && (
        <div>
          <h3>Social Links</h3>
          {Object.entries(fields.socialLinks).map(([platform, handle]) => (
            <div key={platform} style={{ marginBottom: '0.5rem' }}>
              <strong>{platform}:</strong> {String(handle)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductPreview({ data }: SlideoutPreviewProps) {
  return <div>Product Preview: {data.fields.name}</div>
}

export function GenericPreview({ data }: SlideoutPreviewProps) {
  return <div>Generic Preview: {data.fields.title}</div>
}
