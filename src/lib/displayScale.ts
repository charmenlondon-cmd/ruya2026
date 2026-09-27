// Shared between the admin panel (sender) and the display page (receiver).
// Lets staff fix a TV's overscan/zoom crop from the admin panel instead of
// typing a ?scale= URL on the TV itself. Sent as a Realtime Broadcast
// (no DB table needed) and cached in the receiving browser's localStorage
// so a display page reload keeps the last value even without a live sender.

export const DEFAULT_DISPLAY_SCALE = 0.9

function storageKey(lane: string): string {
  return `ruya-display-scale-${lane}`
}

export function displayScaleChannelName(lane: string): string {
  return `display-scale-${lane}`
}

export function getStoredDisplayScale(lane: string): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(lane))
    const value = raw ? Number(raw) : null
    return value && value > 0 && value <= 1 ? value : null
  } catch {
    return null
  }
}

export function setStoredDisplayScale(lane: string, scale: number): void {
  try {
    window.localStorage.setItem(storageKey(lane), String(scale))
  } catch {
    // Storage may be unavailable (private browsing, TV browser quirks) — fine,
    // the broadcast still applies live, it just won't survive a reload.
  }
}
