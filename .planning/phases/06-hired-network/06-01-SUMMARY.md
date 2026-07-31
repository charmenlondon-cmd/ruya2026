# 06-01 Summary: Hired Network Screen — JS Lissajous Constellation

**Plan:** 06-01
**Phase:** 06-hired-network
**Status:** In progress — human visual QA: "looking better, not perfect"; stopped for the day
**Date:** 2026-07-31

## What Was Built

### useHires hook (commit: fec97cc)
- `src/hooks/useHires.ts` — fetches all rows from `hires` table on mount, returns `Hire[]`

### HiredNetworkScreen — JS animation (commit: bd34fc8, final)
- `src/components/display/HiredNetworkScreen.tsx`
- Each hire renders as a `HireCard`: avatar circle + name + track stacked, track-coloured ring border
- **Animation:** `requestAnimationFrame` loop per card — no CSS keyframes, no D3
  - Two sine waves (X/Y) with irrational-ratio periods (70–126s X, 89–160s Y) → Lissajous paths covering the full container
  - `container.offsetWidth/offsetHeight` read at runtime — adapts to any screen size
  - `left`/`top` set by JS; `transform: translate(-50%,-50%)` handles centering only (no conflict)
  - Negative time offset so cards appear mid-path on mount
- Faint AAAH logo at 12% opacity centred as backdrop
- Empty state message if `hires.length === 0`

### 1-minute inactivity timer (commit: 9dc9bcd)
- `display/page.tsx`: 60s `setTimeout` fires `showHiredNetwork = true` when session is idle/screensaver/absent
- Resets to `false` on any active game state; `ScreensaverScreen` shows for the first 60s

### Bug fixes during QA
- `a808e4f` — `flex:1` so container fills flex-column parent (cards were being clipped at height 0)
- `c6eb4a0`, `2a6c7b4` — intermediate CSS attempts (CSS custom properties, baked keyframes) — abandoned
- `bd34fc8` — final JS approach accepted
- `983fd20`, `bd34fc8` — route group experiment (headerless display) tried and reverted at user request

## Key Decisions

- **CSS keyframes abandoned** — three CSS approaches failed; JS `requestAnimationFrame` is definitive
- **Lissajous paths** — irrational X:Y period ratio → complex non-repeating full-screen coverage
- **Container-aware** — `offsetWidth/Height` at runtime; no hard-coded pixel values
- **Header stays** — user confirmed display page should keep the AAAH header

## Verification

- `npx tsc --noEmit` — clean
- `npm run build` — clean
- Human QA — partially approved; animation acceptable, refinement possible in future session

## Outstanding / Resume Notes

- Animation coverage could be improved (user noted "not perfect") — acceptable for now, revisit if needed
- Plan 06-02 (Realtime live updates) not yet started — begin here next session
