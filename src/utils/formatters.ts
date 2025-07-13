import { format, parseISO, isValid } from 'date-fns'
import { ContentfulEntry } from '@/types'

export const formatters = {
  date: (dateString: string, formatStr = 'MMM dd, yyyy') => {
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, formatStr) : 'Invalid date'
    } catch {
      return 'Invalid date'
    }
  },

  entryTitle: (entry: ContentfulEntry): string => {
    const fields = entry.fields
    return fields.title || fields.name || `Entry ${entry.sys.id.slice(0, 8)}`
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  },
}
