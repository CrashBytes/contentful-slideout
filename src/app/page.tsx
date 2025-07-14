// src/app/page.tsx
'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { 
  useContentfulEntries, 
  useContentfulContentTypes, 
  useContentfulHealth 
} from '@/hooks/use-contentful'

// Simple Status Card Component
function StatusCard({ label, value, status }: { 
  label: string
  value: string | number
  status: 'success' | 'loading' | 'error'
}) {
  const statusColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    loading: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  return (
    <div className={`p-4 rounded-lg border ${statusColors[status]}`}>
      <div className="font-medium">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

// Contentful System Status
function ContentfulSystemStatus() {
  const { isConnected, isLoading, hasError, entryCount, space } = useContentfulHealth()
  const contentTypesQuery = useContentfulContentTypes()

  const getStatus = () => {
    if (isLoading) return 'loading'
    if (hasError) return 'error'
    if (isConnected) return 'success'
    return 'error'
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatusCard
        label="Contentful API"
        value={isConnected ? 'Connected' : hasError ? 'Error' : 'Connecting...'}
        status={getStatus()}
      />
      <StatusCard
        label="Space Name"
        value={space?.name || 'Loading...'}
        status={getStatus()}
      />
      <StatusCard
        label="Total Entries"
        value={entryCount}
        status={getStatus()}
      />
      <StatusCard
        label="Content Types"
        value={contentTypesQuery.data?.length || 0}
        status={contentTypesQuery.isSuccess ? 'success' : contentTypesQuery.isLoading ? 'loading' : 'error'}
      />
    </div>
  )
}

// Recent Content Display
function RecentContent() {
  const { data: entriesData, isLoading, error } = useContentfulEntries()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium">Unable to load content</div>
        <div className="text-slate-600 text-sm">Check your Contentful configuration</div>
      </div>
    )
  }

  const entries = entriesData?.entries || []

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Recent Content</h3>
      <div className="space-y-3">
        {entries.slice(0, 5).map((entry) => {
          const title = entry.fields.title || entry.fields.name || `Entry ${entry.sys.id.slice(0, 8)}`
          return (
            <div key={entry.sys.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="font-medium text-slate-900">{String(title)}</div>
              <div className="text-sm text-slate-500 mt-1">
                <span className="px-2 py-1 bg-slate-100 rounded text-xs mr-2">
                  {entry.sys.contentType.sys.id}
                </span>
                <span>
                  {new Date(entry.sys.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Feature Cards Component
function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Flexible Preview</h3>
        <p className="text-slate-600">Support for any content type with custom preview components</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Responsive Design</h3>
        <p className="text-slate-600">Desktop, tablet, and mobile view modes with adaptive layouts</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Integration</h3>
        <p className="text-slate-600">Drop-in component for any Next.js application</p>
      </div>
    </div>
  )
}

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Flexible Slideout
            <span className="block text-yellow-300 mt-2">Component</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            A powerful, reusable slideout component for Next.js that mimics Contentful's live preview functionality.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/demo"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Demo
            </Link>
            <a 
              href="#features"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Everything You Need for Content Previews
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built for developers who need flexible, performant content preview functionality.
          </p>
        </div>

        <FeatureCards />

        {/* System Status */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Live System Status
          </h2>
          <Suspense fallback={<div className="text-center">Loading system status...</div>}>
            <ContentfulSystemStatus />
          </Suspense>
        </div>

        {/* Content Overview */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Suspense fallback={<div>Loading content...</div>}>
              <RecentContent />
            </Suspense>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Start</h3>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-slate-900">1. Install Dependencies</div>
                  <div className="text-sm text-slate-600 bg-slate-100 p-2 rounded mt-1 font-mono">
                    npm install date-fns lucide-react
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">2. Copy Components</div>
                  <div className="text-sm text-slate-600">Copy FlexibleSlideout and preview components to your project</div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">3. Use in Your App</div>
                  <div className="text-sm text-slate-600">Import and use with your content types</div>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/demo"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    See it in action
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}