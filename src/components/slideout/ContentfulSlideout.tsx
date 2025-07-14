'use client'

import { Fragment, useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Save, Eye, MoreHorizontal } from 'lucide-react'

export interface ContentfulField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number' | 'date' | 'richtext'
  value: any
  required?: boolean
  helpText?: string
  options?: string[]
  maxLength?: number
  placeholder?: string
}

export interface ContentfulSection {
  id: string
  title: string
  collapsible?: boolean
  defaultCollapsed?: boolean
  fields: ContentfulField[]
}

export interface ContentfulEntry {
  sys: {
    id: string
    contentType: { 
      sys: { id: string }
      name: string
    }
    createdAt: string
    updatedAt: string
    publishedAt?: string
    version: number
  }
  sections: ContentfulSection[]
  metadata?: {
    tags?: string[]
    status?: 'draft' | 'published' | 'changed'
  }
}

export interface ContentfulSlideoutProps {
  isOpen: boolean
  onClose: () => void
  entry: ContentfulEntry | null
  onSave?: (entry: ContentfulEntry) => void
  onPublish?: (entry: ContentfulEntry) => void
  onPreview?: (entry: ContentfulEntry) => void
  readOnly?: boolean
}

export function ContentfulSlideout({
  isOpen,
  onClose,
  entry,
  onSave,
  onPublish,
  onPreview,
  readOnly = false
}: ContentfulSlideoutProps) {
  const [formData, setFormData] = useState<ContentfulEntry | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (entry) {
      setFormData(JSON.parse(JSON.stringify(entry)))
      const initialCollapsed = new Set(
        entry.sections
          .filter(section => section.defaultCollapsed)
          .map(section => section.id)
      )
      setCollapsedSections(initialCollapsed)
    }
  }, [entry])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleFieldChange = (sectionId: string, fieldId: string, value: any) => {
    if (!formData || readOnly) return

    const updatedData = { ...formData }
    const section = updatedData.sections.find(s => s.id === sectionId)
    if (section) {
      const field = section.fields.find(f => f.id === fieldId)
      if (field) {
        field.value = value
        setFormData(updatedData)
        setHasChanges(true)
      }
    }
  }

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId)
    } else {
      newCollapsed.add(sectionId)
    }
    setCollapsedSections(newCollapsed)
  }

  const handleSave = () => {
    if (formData && onSave) {
      onSave(formData)
      setHasChanges(false)
    }
  }

  const handlePublish = () => {
    if (formData && onPublish) {
      onPublish(formData)
      setHasChanges(false)
    }
  }

  const renderField = (field: ContentfulField, sectionId: string) => {
    const fieldValue = field.value || ''

    const fieldClasses = `
      w-full px-3 py-2 border border-gray-300 rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500
    `

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={readOnly}
            className={fieldClasses}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            disabled={readOnly}
            rows={4}
            className={fieldClasses + ' resize-vertical'}
          />
        )

      case 'select':
        return (
          <select
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            disabled={readOnly}
            className={fieldClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="radio"
                name={`${sectionId}-${field.id}`}
                checked={fieldValue === true}
                onChange={() => handleFieldChange(sectionId, field.id, true)}
                disabled={readOnly}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`${sectionId}-${field.id}`}
                checked={fieldValue === false}
                onChange={() => handleFieldChange(sectionId, field.id, false)}
                disabled={readOnly}
                className="mr-2"
              />
              No
            </label>
            <button 
              onClick={() => handleFieldChange(sectionId, field.id, null)}
              disabled={readOnly}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear
            </button>
          </div>
        )

      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, parseInt(e.target.value) || '')}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={fieldClasses}
          />
        )

      case 'date':
        return (
          <input
            type="datetime-local"
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            disabled={readOnly}
            className={fieldClasses}
          />
        )

      default:
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            disabled={readOnly}
            className={fieldClasses}
          />
        )
    }
  }

  if (!isOpen || !formData) return null

  return (
    <Fragment>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`
        fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {formData.sys.contentType.name}
              </h2>
              {hasChanges && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Unsaved changes
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>ID: {formData.sys.id}</div>
            <div>Version: {formData.sys.version}</div>
            <div>Updated: {new Date(formData.sys.updatedAt).toLocaleString()}</div>
            {formData.metadata?.status && (
              <div className="flex items-center space-x-2">
                <span>Status:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  formData.metadata.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : formData.metadata.status === 'changed'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.metadata.status}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {formData.sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => section.collapsible && toggleSection(section.id)}
                  className={`
                    w-full px-4 py-3 text-left font-medium text-gray-900 
                    bg-gray-50 border-b border-gray-200 rounded-t-lg
                    ${section.collapsible ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}
                    flex items-center justify-between
                  `}
                >
                  <span>{section.title}</span>
                  {section.collapsible && (
                    collapsedSections.has(section.id) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronUp className="w-4 h-4" />
                  )}
                </button>

                {(!section.collapsible || !collapsedSections.has(section.id)) && (
                  <div className="p-4 space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {renderField(field, section.id)}
                        
                        {field.helpText && (
                          <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                        )}
                        
                        {field.maxLength && field.type === 'text' && (
                          <p className="mt-1 text-xs text-gray-500">
                            {(field.value || '').length} / {field.maxLength} characters
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {onPreview && (
                <button 
                  onClick={() => onPreview(formData)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {onSave && (
                <button 
                  onClick={handleSave}
                  disabled={!hasChanges || readOnly}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              )}
              
              {onPublish && (
                <button 
                  onClick={handlePublish}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
