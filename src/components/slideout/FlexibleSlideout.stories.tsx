import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { FlexibleSlideout } from './FlexibleSlideout'
import { 
  BlogPostPreview, 
  AuthorPreview, 
  ProductPreview, 
  GenericPreview 
} from './entry-previews'

// Mock data
const mockBlogPost = {
  sys: {
    id: 'blog-post-1',
    contentType: { sys: { id: 'blogPost' } },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  fields: {
    title: 'The Ultimate Guide to Modern Web Development',
    slug: 'ultimate-guide-modern-web-development',
    excerpt: 'Discover the latest trends, tools, and techniques that are shaping the future of web development in 2024.',
    content: 'Modern web development has evolved dramatically...',
    publishedDate: '2024-01-15T10:00:00Z',
    tags: ['web development', 'react', 'nextjs', 'typescript'],
    readTime: 12,
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
    bio: 'Senior Frontend Developer with 8+ years of experience building scalable web applications.',
    email: 'alex.thompson@example.com',
    socialLinks: {
      twitter: '@alexthompson_dev',
      linkedin: 'alex-thompson-dev',
      github: 'alexthompson'
    },
  }
}

const entryTypes = {
  blogPost: {
    id: 'blogPost',
    name: 'Blog Post',
    contentTypeId: 'blogPost',
    previewComponent: BlogPostPreview
  },
  author: {
    id: 'author',
    name: 'Author',
    contentTypeId: 'author',
    previewComponent: AuthorPreview
  }
}

const meta: Meta<typeof FlexibleSlideout> = {
  title: 'Components/FlexibleSlideout',
  component: FlexibleSlideout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible slideout component that mimics Contentful\'s live preview functionality.',
      },
    },
  },
  argTypes: {
    isOpen: {
      description: 'Controls whether the slideout is visible',
      control: 'boolean',
    },
    viewMode: {
      description: 'Current viewport mode',
      control: 'select',
      options: ['desktop', 'tablet', 'mobile'],
    },
    onClose: {
      description: 'Callback fired when slideout is closed',
      action: 'closed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const BlogPost: Story = {
  args: {
    isOpen: true,
    entryType: entryTypes.blogPost,
    data: mockBlogPost,
    props: {
      showReadTime: true,
      showTags: true,
      allowEdit: true
    },
    viewMode: 'desktop',
    onClose: action('slideout-closed'),
  },
  render: (args) => (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: '100%', color: 'white' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Demo Application</h1>
        <p style={{ marginBottom: '1rem' }}>
          This simulates your main application. The slideout appears on top.
        </p>
        <button 
          style={{ 
            background: '#fff', 
            color: '#333', 
            padding: '0.5rem 1rem', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
          onClick={action('content-clicked')}
        >
          Click to view content
        </button>
      </div>
      <FlexibleSlideout {...args} />
    </div>
  ),
}

export const Author: Story = {
  args: {
    ...BlogPost.args,
    entryType: entryTypes.author,
    data: mockAuthor,
    props: {
      showSocialLinks: true,
      showContactInfo: true
    },
  },
  render: BlogPost.render,
}

export const MobileView: Story = {
  args: {
    ...BlogPost.args,
    viewMode: 'mobile',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  render: BlogPost.render,
}

// Add this new story to your existing file
export const WithRealContentfulData: Story = {
  args: {
    isOpen: true,
    entryType: entryTypes.blogPost,
    data: {
      sys: {
        id: 'your-real-entry-id',
        contentType: { sys: { id: 'blogPost' } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      fields: {
        // Replace with your actual Contentful field data
        title: 'Your Real Blog Post Title',
        excerpt: 'Your real excerpt from Contentful',
        content: 'Your real content...',
        tags: ['your', 'real', 'tags'],
        readTime: 5,
      }
    },
    props: {
      showReadTime: true,
      showTags: true,
      allowEdit: true
    },
    viewMode: 'desktop',
    onClose: action('slideout-closed'),
  },
  render: BlogPost.render,
}
