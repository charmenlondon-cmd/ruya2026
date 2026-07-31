# 06-01 Summary: Static Hired Network Visualization

**Plan:** 06-01
**Phase:** 06-hired-network
**Status:** Awaiting human verification (checkpoint)
**Date:** 2026-07-31

## What Was Built

### Task 1 — Install D3 + useHires hook (commit: fec97cc)
- Installed `d3` and `@types/d3` packages
- Created `src/hooks/useHires.ts`: `'use client'` hook that fetches all rows from `hires` table ordered by `hired_at`, returns `Hire[]`
- Mirrors `useSession.ts` pattern — simple, no Realtime (Phase 06-02 adds that)

### Task 2 — HiredNetworkCanvas + ScreensaverScreen integration (commit: 8ffe58a)
- Created `src/components/display/HiredNetworkCanvas.tsx`:
  - 10 track cluster angles (36° apart clockwise from top, Engineering at 270°)
  - 10 distinct track colours (blue, emerald, pink, orange, violet, amber, red, teal, fuchsia, light green)
  - D3 force simulation: collision avoidance, charge repulsion, custom cluster force, weak centre pull
  - Canvas draws avatar images (PNG from `/avatars/`) with circular clip + coloured ring per track; colour-filled circle fallback while images load
  - Canvas at z-5 (inline style), absolutely positioned, pointer-events-none
  - Node positions preserved across hires updates (existingById merge)
- Modified `src/components/display/ScreensaverScreen.tsx`:
  - Imports `useHires` and `HiredNetworkCanvas`
  - Calls `const hires = useHires()` at component top
  - Renders `<HiredNetworkCanvas hires={hires} />` as first child inside outer div

## Verification Results
- `npx tsc --noEmit` — clean (no errors)
- `npm run build` — clean (Next.js 16.2.10 Turbopack, all routes static)
- Human visual verification — **PENDING** (checkpoint task 3)

## Key Decisions
- Inline `style={{ zIndex: 5 }}` used instead of Tailwind `z-5` (may not be in Tailwind v4 default scale)
- Simulation stops on cleanup, restarted with `alpha(0.6)` on hires changes
- Errors from Supabase query silently ignored — empty array is safe fallback
