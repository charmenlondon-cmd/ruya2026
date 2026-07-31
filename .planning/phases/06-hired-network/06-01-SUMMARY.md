# 06-01 Summary: CSS Constellation Hired Network Visualization

**Plan:** 06-01
**Phase:** 06-hired-network
**Status:** Complete (human checkpoint passed — approach revised to CSS constellation)
**Date:** 2026-07-31

## What Was Built

### Cleanup — Remove D3 approach (commit: 1c79ffe)
- Deleted `src/components/display/HiredNetworkCanvas.tsx` (D3 force simulation)
- Reverted `src/components/display/ScreensaverScreen.tsx` to its pre-06-01 state (no useHires, no HiredNetworkCanvas)
- Uninstalled `d3` and `@types/d3`
- Kept `src/hooks/useHires.ts` unchanged — still needed for the CSS approach

### Task 1 — HiredNetworkScreen CSS constellation (commit: fe8c1fe)
- Created `src/components/display/HiredNetworkScreen.tsx`
- Pure CSS implementation — no D3, no Canvas
- Each hire is an absolutely-positioned div with a stable seeded position derived from `hire.id` via `seedFromId()` (deterministic hash — no `Math.random()`, no position jumping on re-render)
- `left`: 10–90% of width; `top`: 10–90% of height
- CSS `@keyframes float` with per-node duration (25–45s) and negative animation delay so all nodes are already mid-motion on mount — organic, non-synchronised movement
- `@keyframes fadeIn` fades each card in from scale 0.7 on mount
- Coloured ring border + avatar `<img>` + player name + track name per card
- 10 track colours matching AAAH brand palette (blue, emerald, pink, orange, violet, amber, red, teal, fuchsia, light green)
- Faint AAAH logo (`/logos/aaah-logo-white.png`) centred at 15% opacity behind nodes
- Empty state: "No hires yet today" message if `hires.length === 0`
- `onError` fallback on avatar img hides broken image icons gracefully

### Task 2 — 1-minute inactivity timer in display/page.tsx (commit: 9dc9bcd)
- Added `useHires()` call at page level (data ready before switch)
- Added `showHiredNetwork` state (default `false`)
- `useEffect` watches `session?.state`: sets 60s timer when state is `idle`, `screensaver`, or no session; clears and resets to `false` on any active game state
- Render: idle/screensaver case returns `<HiredNetworkScreen hires={hires} />` when `showHiredNetwork`, else `<ScreensaverScreen />`

## Verification Results
- `npx tsc --noEmit` — clean (no errors)
- `npm run build` — clean (Next.js 16.2.10 Turbopack, all routes static)
- Human visual verification — **PENDING** (checkpoint)

## Key Decisions
- **CSS over D3** — D3 force simulation produced random bobbing/drifting; pure CSS float with seeded positions gives stable, pleasant constellation appearance
- **Negative animationDelay** — All nodes appear already-moving on mount rather than starting from rest simultaneously
- **seedFromId() hash** — Deterministic position from hire.id; no re-renders cause position jumps
- **`<img>` not Next.js `<Image>`** — Avatars are dynamically loaded by id from `/avatars/`; Next.js Image requires explicit width/height; plain `<img>` with objectFit is simpler for circular clip context
- **useHires at page level** — Data fetched once at display/page, passed as prop; avoids duplicate subscriptions when switching between ScreensaverScreen and HiredNetworkScreen
- **useHires errors silently ignored** — Empty array is safe fallback; the network screen renders the empty state without crashing
