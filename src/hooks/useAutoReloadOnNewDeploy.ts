'use client'

import { useEffect, useRef } from 'react'

// Venue TVs run /display unattended for hours. Without this, shipping a
// code update means physically walking to each TV to refresh it. Polls a
// version marker (/api/version) and reloads the page the moment a new
// deployment is detected. Safe to do at any time — the page is a pure
// reflection of server state (Supabase), so a reload just re-fetches and
// re-renders whatever's currently happening, no progress lost.
const POLL_INTERVAL_MS = 60_000

export function useAutoReloadOnNewDeploy() {
  const initialVersion = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkVersion() {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' })
        const { version } = (await res.json()) as { version: string }
        if (cancelled) return

        if (initialVersion.current === null) {
          initialVersion.current = version
        } else if (version !== initialVersion.current) {
          window.location.reload()
        }
      } catch {
        // Network hiccup — just try again next interval.
      }
    }

    checkVersion()
    const id = setInterval(checkVersion, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])
}
