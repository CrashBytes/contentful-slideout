import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Enterprise Portal Component
 * 
 * Architectural Excellence:
 * - Server-side rendering compatibility
 * - Automatic container lifecycle management
 * - Memory leak prevention through proper cleanup
 * - Graceful degradation for missing containers
 */
interface PortalProps {
  children: ReactNode
  container?: HTMLElement
  id?: string
}

export function Portal({ children, container, id = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    let element = container
    
    if (!element) {
      element = document.getElementById(id)
      
      if (!element) {
        element = document.createElement('div')
        element.id = id
        element.style.position = 'fixed'
        element.style.top = '0'
        element.style.left = '0'
        element.style.zIndex = '9999'
        document.body.appendChild(element)
      }
    }
    
    setPortalContainer(element)
    setMounted(true)

    return () => {
      setMounted(false)
      if (!container && element && element.id === id && !element.hasChildNodes()) {
        document.body.removeChild(element)
      }
    }
  }, [container, id])

  if (!mounted || !portalContainer) {
    return null
  }

  return createPortal(children, portalContainer)
}
