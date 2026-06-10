'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient, type ContentfulClientApi } from 'contentful'

// Create Contentful clients lazily, so they are instantiated at runtime (in the
// browser, when a query actually runs) rather than at module load. Eager
// instantiation executes during the production build's prerender step, where no
// Contentful token is available and `createClient` throws
// "Expected parameter accessToken", which fails the build.
let _contentfulClient: ContentfulClientApi<undefined> | undefined
let _previewClient: ContentfulClientApi<undefined> | undefined

function getContentfulClient(): ContentfulClientApi<undefined> {
  if (!_contentfulClient) {
    _contentfulClient = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    })
  }
  return _contentfulClient
}

function getPreviewClient(): ContentfulClientApi<undefined> {
  if (!_previewClient) {
    _previewClient = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN!,
      host: 'preview.contentful.com',
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    })
  }
  return _previewClient
}

/**
 * Hook for fetching all entries from your Contentful space
 */
export function useContentfulEntries(preview: boolean = false) {
  return useQuery({
    queryKey: ['contentful-entries', preview],
    queryFn: async () => {
      const client = preview ? getPreviewClient() : getContentfulClient()

      try {
        const response = await client.getEntries({
          limit: 50,
          include: 1,
        })

        return {
          entries: response.items,
          total: response.total,
        }
      } catch (error) {
        console.error('Error fetching Contentful entries:', error)
        throw new Error('Failed to fetch content from Contentful')
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

/**
 * Hook for fetching content types
 */
export function useContentfulContentTypes() {
  return useQuery({
    queryKey: ['contentful-content-types'],
    queryFn: async () => {
      try {
        const response = await getContentfulClient().getContentTypes()
        return response.items
      } catch (error) {
        console.error('Error fetching content types:', error)
        throw new Error('Failed to fetch content types from Contentful')
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook for Contentful space information
 */
export function useContentfulSpace() {
  return useQuery({
    queryKey: ['contentful-space'],
    queryFn: async () => {
      try {
        const space = await getContentfulClient().getSpace()
        const defaultLocale =
          space.locales.find((l: any) => l.default)?.code || 'en-US'
        return {
          name: space.name,
          locales: space.locales,
          defaultLocale,
        }
      } catch (error) {
        console.error('Error fetching space information:', error)
        throw new Error('Failed to connect to Contentful space')
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
  })
}

/**
 * Connection status hook for system health monitoring
 */
export function useContentfulHealth() {
  const spaceQuery = useContentfulSpace()
  const entriesQuery = useContentfulEntries()

  return {
    isConnected: spaceQuery.isSuccess && entriesQuery.isSuccess,
    isLoading: spaceQuery.isLoading || entriesQuery.isLoading,
    hasError: spaceQuery.isError || entriesQuery.isError,
    error: spaceQuery.error || entriesQuery.error,
    space: spaceQuery.data,
    entryCount: entriesQuery.data?.total || 0,
  }
}
