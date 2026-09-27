'use client'

import { useEffect, useState } from 'react'

// Browsers won't let a page hide its own address bar without a real user tap
// — the Fullscreen API requires a user gesture, so this can't be automatic.
// Staff taps this once after loading the display each morning; it hides
// itself once fullscreen is active and reappears if it's ever exited.
type FullscreenDocumentElement = HTMLElement & {
  webkitRequestFullscreen?: () => void
}
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
}

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const doc = document as FullscreenDocument
    const update = () => setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement))
    update()
    document.addEventListener('fullscreenchange', update)
    document.addEventListener('webkitfullscreenchange', update)
    return () => {
      document.removeEventListener('fullscreenchange', update)
      document.removeEventListener('webkitfullscreenchange', update)
    }
  }, [])

  if (isFullscreen) return null

  function enterFullscreen() {
    const el = document.documentElement as FullscreenDocumentElement
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }

  return (
    <button
      onClick={enterFullscreen}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-semibold backdrop-blur-sm"
    >
      ⛶ Full Screen
    </button>
  )
}
