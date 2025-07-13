import { useQuery } from '@tanstack/react-query'
import { contentfulClient } from '@/lib/contentful/client'
import { ContentfulEntry } from '@/types'

/**
 * Type-Safe Contentful Data Fetching Hooks
 * 
 * Design Excellence:
 * - Comprehensive error handling with loading states
 * - Automatic retry logic for transient failures
 * - Performance optimization through intelligent caching
 * - Type safety throughout the data flow
 */
export function useContentfulEntry(id: string, options: {
  preview?: boolean
  locale?: string
  enabled?: boolean
} = {}) {
  const { preview = false, locale, enabled = true } = options

  return useQuery({
    queryKey: ['contentful', 'entry', id, { preview, locale }],
    queryFn: () => contentfulClient.getEntry(id, { preview, locale }),
    enabled: enabled && !!id,
    staleTime: preview ? 0 : 5 * 60 * 1000,
  })
}

export function useContentfulEntries(contentType?: string, options: {
  preview?: boolean
  locale?: string
  limit?: number
  enabled?: boolean
} = {}) {
  const { preview = false, locale, limit = 100, enabled = true } = options

  return useQuery({
    queryKey: ['contentful', 'entries', contentType, { preview, locale, limit }],
    queryFn: () => contentfulClient.getEntries(contentType, { preview, locale, limit }),
    enabled,
    staleTime: preview ? 0 : 5 * 60 * 1000,
  })
}
