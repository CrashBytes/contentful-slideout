'use client'

import { Suspense } from 'react'
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

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Contentful Preview
            <span className="block text-yellow-300 mt-2">System</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Live content management system connected to your Contentful space.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-slate-900">Space ID</div>
                  <div className="text-sm text-slate-600">{process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Environment</div>
                  <div className="text-sm text-slate-600">{process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Status</div>
                  <div className="text-sm text-green-600">✅ Live Connection Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}