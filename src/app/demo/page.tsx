// src/app/demo/page.tsx
'use client'

import { useState } from 'react'
import { usePreviewStore } from '@/stores/preview-store'
import { FlexibleSlideout } from '@/components/slideout/FlexibleSlideout'
import { 
  BlogPostPreview, 
  AuthorPreview, 
  ProductPreview,
  GenericPreview 
} from '@/components/slideout/entry-previews'

// Mock data for different content types
const mockBlogPost = {
  sys: {
    id: 'blog-1',
    contentType: { sys: { id: 'blogPost' } },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  fields: {
    title: 'Building Modern Web Applications',
    slug: 'building-modern-web-apps',
    excerpt: 'Learn the latest techniques for building scalable web applications with Next.js and React.',
    content: {
      nodeType: 'document',
      content: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'This is a comprehensive guide to building modern web applications...' }]
        }
      ]
    },
    publishedDate: '2024-01-15T10:00:00Z',
    tags: ['web development', 'react', 'nextjs'],
    readTime: 8
  }
}

const mockAuthor = {
  sys: {
    id: 'author-1',
    contentType: { sys: { id: 'author' } },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  fields: {
    name: 'Alex Thompson',
    bio: 'Senior Frontend Developer with 8+ years of experience in React and TypeScript.',
    email: 'alex@example.com',
    avatar: {
      fields: {
        file: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        }
      }
    },
    socialLinks: {
      twitter: '@alexthompson',
      linkedin: 'alex-thompson-dev',
      github: 'alexthompson'
    }
  }
}

const mockProduct = {
  sys: {
    id: 'product-1',
    contentType: { sys: { id: 'product' } },
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-19T13:20:00Z',
  },
  fields: {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 299.99,
    currency: 'USD',
    category: 'Electronics',
    inStock: true,
    images: [
      {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
          }
        }
      }
    ],
    specifications: {
      batteryLife: '30 hours',
      weight: '250g',
      connectivity: 'Bluetooth 5.0'
    }
  }
}

const mockGenericContent = {
  sys: {
    id: 'generic-1',
    contentType: { sys: { id: 'customContent' } },
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-21T10:15:00Z',
  },
  fields: {
    title: 'Custom Content Example',
    customField1: 'This is a custom field',
    customField2: 42,
    customField3: ['tag1', 'tag2', 'tag3'],
    nestedObject: {
      property1: 'value1',
      property2: 'value2'
    }
  }
}

// Entry type configurations
const entryConfigurations = {
  blogPost: {
    entryType: {
      id: 'blogPost',
      name: 'Blog Post',
      contentTypeId: 'blogPost',
      previewComponent: BlogPostPreview
    },
    data: mockBlogPost,
    props: {
      showReadTime: true,
      showTags: true,
      allowEdit: true
    }
  },
  author: {
    entryType: {
      id: 'author',
      name: 'Author',
      contentTypeId: 'author',
      previewComponent: AuthorPreview
    },
    data: mockAuthor,
    props: {
      showSocialLinks: true,
      showContactInfo: false
    }
  },
  product: {
    entryType: {
      id: 'product',
      name: 'Product',
      contentTypeId: 'product',
      previewComponent: ProductPreview
    },
    data: mockProduct,
    props: {
      showPricing: true,
      showInventory: true,
      currency: 'USD'
    }
  },
  customContent: {
    entryType: {
      id: 'customContent',
      name: 'Custom Content',
      contentTypeId: 'customContent',
      previewComponent: GenericPreview
    },
    data: mockGenericContent,
    props: {
      showAllFields: true,
      debugMode: true
    }
  }
}

// Content Card Component
function ContentCard({ 
  title, 
  type, 
  description, 
  onClick,
  image 
}: {
  title: string
  type: string
  description: string
  onClick: () => void
  image?: string
}) {
  return (
    <div 
      className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
      onClick={onClick}
    >
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {type}
        </span>
      </div>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      <div className="flex items-center text-blue-600 text-sm font-medium">
        <span>Click to preview</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

export default function DemoPage() {
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<any>(null)

  const handleContentClick = (configKey: keyof typeof entryConfigurations) => {
    const config = entryConfigurations[configKey]
    setCurrentEntry(config)
    setIsSlideoutOpen(true)
  }

  const handleCloseSlideout = () => {
    setIsSlideoutOpen(false)
    setCurrentEntry(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Flexible Slideout Demo
          </h1>
          <p className="text-xl text-slate-600">
            Click on any content item below to view it in the slideout preview
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog Post */}
          <ContentCard
            title="Building Modern Web Applications"
            type="Blog Post"
            description="Learn the latest techniques for building scalable web applications with Next.js and React."
            onClick={() => handleContentClick('blogPost')}
            image="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop"
          />

          {/* Author */}
          <ContentCard
            title="Alex Thompson"
            type="Author"
            description="Senior Frontend Developer with 8+ years of experience in React and TypeScript."
            onClick={() => handleContentClick('author')}
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=face"
          />

          {/* Product */}
          <ContentCard
            title="Premium Wireless Headphones"
            type="Product"
            description="High-quality wireless headphones with noise cancellation technology."
            onClick={() => handleContentClick('product')}
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop"
          />

          {/* Custom Content */}
          <ContentCard
            title="Custom Content Example"
            type="Custom"
            description="Example of how the slideout handles generic content types with custom fields."
            onClick={() => handleContentClick('customContent')}
          />

          {/* Add more content items */}
          <ContentCard
            title="Another Blog Post"
            type="Blog Post"
            description="Another example blog post to demonstrate multiple entries of the same type."
            onClick={() => handleContentClick('blogPost')}
            image="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop"
          />

          <ContentCard
            title="Marketing Content"
            type="Custom"
            description="Custom marketing content with specialized fields and configurations."
            onClick={() => handleContentClick('customContent')}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use</h2>
          <div className="prose prose-slate max-w-none">
            <p>This demo shows how to create a flexible slideout that can handle different content types:</p>
            <ul>
              <li><strong>Blog Posts:</strong> Custom preview with reading time, tags, and content preview</li>
              <li><strong>Authors:</strong> Profile view with bio, avatar, and social links</li>
              <li><strong>Products:</strong> Product details with pricing, inventory, and specifications</li>
              <li><strong>Custom Content:</strong> Generic preview that adapts to any content structure</li>
            </ul>
            <p>Each content type can have its own:</p>
            <ul>
              <li>Custom preview component</li>
              <li>Specific props and configuration</li>
              <li>Unique styling and layout</li>
              <li>Interactive elements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flexible Slideout */}
      {currentEntry && (
        <FlexibleSlideout
          isOpen={isSlideoutOpen}
          onClose={handleCloseSlideout}
          entryType={currentEntry.entryType}
          data={currentEntry.data}
          props={currentEntry.props}
        />
      )}
    </div>
  )
}