import { Entry, Asset, Sys } from 'contentful'

export interface ContentfulSys extends Sys {
  contentType: {
    sys: {
      id: string
      type: string
    }
  }
  locale?: string
}

export interface ContentfulEntry<T = any> extends Entry<T> {
  sys: ContentfulSys
}

export interface ContentfulAsset extends Asset {
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

export interface BlogPostFields {
  title: string
  slug: string
  excerpt?: string
  content: any
  featuredImage?: ContentfulAsset
  author?: ContentfulEntry<AuthorFields>
  tags?: string[]
  publishedDate: string
  category?: ContentfulEntry<CategoryFields>
}

export interface AuthorFields {
  name: string
  bio?: any
  avatar?: ContentfulAsset
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface CategoryFields {
  name: string
  slug: string
  description?: string
  color?: string
}

export const isBlogPost = (entry: ContentfulEntry): entry is ContentfulEntry<BlogPostFields> => {
  return entry.sys.contentType.sys.id === 'blogPost'
}

export const isAuthor = (entry: ContentfulEntry): entry is ContentfulEntry<AuthorFields> => {
  return entry.sys.contentType.sys.id === 'author'
}
