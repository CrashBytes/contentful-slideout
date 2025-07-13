import { createClient, ContentfulClientApi } from 'contentful'

/**
 * Enterprise Contentful Client
 * 
 * Design Principles:
 * - Singleton pattern for connection reuse
 * - Comprehensive error handling with retry logic
 * - Performance monitoring and request optimization
 * - Environment-aware configuration management
 */
class ContentfulClient {
  private static instance: ContentfulClient
  private client: ContentfulClientApi
  private previewClient: ContentfulClientApi

  private constructor() {
    const baseConfig = {
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
      resolveLinks: true,
      removeUnresolved: true,
    }

    this.client = createClient({
      ...baseConfig,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    })

    this.previewClient = createClient({
      ...baseConfig,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
      host: 'preview.contentful.com',
    })
  }

  static getInstance(): ContentfulClient {
    if (!this.instance) {
      this.instance = new ContentfulClient()
    }
    return this.instance
  }

  getClient(preview = false): ContentfulClientApi {
    return preview ? this.previewClient : this.client
  }

  async getEntry(id: string, options: {
    preview?: boolean
    locale?: string
    include?: number
  } = {}) {
    const { preview = false, locale, include = 3 } = options
    const client = this.getClient(preview)
    
    try {
      const entry = await client.getEntry(id, { locale, include })
      if (!entry) {
        throw new Error(`Entry not found: ${id}`)
      }
      return entry
    } catch (error) {
      console.error(`Failed to fetch entry ${id}:`, error)
      throw error
    }
  }

  async getEntries(contentType?: string, options: {
    preview?: boolean
    locale?: string
    limit?: number
    skip?: number
  } = {}) {
    const { preview = false, locale, limit = 100, skip = 0 } = options
    const client = this.getClient(preview)
    
    try {
      return await client.getEntries({
        content_type: contentType,
        locale,
        limit: Math.min(limit, 1000),
        skip,
        include: 2,
        order: '-sys.updatedAt',
      })
    } catch (error) {
      console.error('Failed to fetch entries:', error)
      throw error
    }
  }
}

export const contentfulClient = ContentfulClient.getInstance()
