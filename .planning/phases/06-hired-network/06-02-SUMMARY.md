# 06-02 Summary: Hired Network — Live Realtime Updates

**Plan:** 06-02
**Phase:** 06-hired-network
**Status:** Complete
**Date:** 2026-08-03

## What Was Built

### useHires Realtime subscription
- `src/hooks/useHires.ts` — added Supabase Realtime channel `hires-feed` subscribing to `INSERT` events on the `hires` table
- New hires appended to state immediately on arrival; channel cleaned up on unmount
- Pattern mirrors `useSession.ts` exactly

### HireCard fade-in for live arrivals
- `src/components/display/HiredNetworkScreen.tsx` — added `isNew` prop to `HireCard`
- Live arrivals (cards not present on initial mount) start at `opacity: 0` and transition to `opacity: 1` over 0.6s via CSS transition
- Double-rAF ensures the browser paints `opacity:0` before the transition fires
- Initial load cards appear immediately (`isNew: false`)

### initialIdsRef tracking
- `HiredNetworkScreen` captures the set of hire IDs present on first render via `initialIdsRef`
- Any ID not in that set is flagged `isNew: true` — correctly distinguishes live arrivals from initial load

### Animation speed increase
- Lissajous period base reduced from `70s` → `35s` (2× speed) at user request after QA
- Range: 35–63s per x-cycle, 44–80s per y-cycle

## Verification

- `npx tsc --noEmit` — clean
- Human QA — approved

## Key Decisions

- **Adapted from plan** — 06-02 plan targeted the removed `HiredNetworkCanvas.tsx`; implementation adapted to `HiredNetworkScreen.tsx` (JS rAF approach)
- **CSS opacity transition** — simpler than canvas `globalAlpha` ramp; works cleanly alongside the JS-driven `left`/`top` animation
