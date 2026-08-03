# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** COMPLETE — live on Vercel, post-deploy polish applied

## Current Position

Phase: 7 of 7 — COMPLETE
Status: SHIPPED — all 7 phases done. App live at https://ruya2026.vercel.app
Last activity: 2026-08-03 — Phase 7 complete + post-deploy fixes (see below)

Progress: ████████████████████ 100%

## Live URLs

| Screen | URL |
|--------|-----|
| Display (big screen) | https://ruya2026.vercel.app/display |
| Controller (iPad) | https://ruya2026.vercel.app/controller |
| Admin (staff) | https://ruya2026.vercel.app/admin |
| Landing | https://ruya2026.vercel.app |

## Infrastructure

- **GitHub:** https://github.com/charmenlondon-cmd/ruya2026 (branch: main)
- **Vercel:** project `ruya2026`, team `charls-projects-dd19784e`
- **Supabase:** https://djjtsfaqzvoksytxzkbf.supabase.co
- **Deploy:** `vercel --prod --yes` from project root (Vercel CLI linked via `.vercel/`)
- **Deployment Protection:** disabled (was blocking public access on team account)

## Performance Metrics

**Velocity:**
- Total plans completed: 14 (12 core + 2 phase 7)
- Total execution time: ~3.5 hours across all sessions

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/3 | 52 min | 17 min |
| 02-realtime-game-engine | 2/2 | 50 min | 25 min |
| 03-question-engine | 2/2 | ~25 min | ~12 min |
| 04-controller-ui | 3/3 | ~60 min | ~20 min |
| 05-display-screen | 3/3 | ~55 min | ~18 min |
| 06-hired-network | 2/2 | ~45 min | ~22 min |
| 07-admin-deploy | 2/2 | ~30 min | ~15 min |

## Accumulated Context

### Decisions

- **package.json name is `ruya-careers-fair-2026`** — directory name violates npm naming rules; they don't need to match.
- **RLS omitted from schema** — anon key, event-day-only, no-auth setup.
- **questions excluded from realtime publication** — read-only after seed.
- **Manual TypeScript types in src/types/database.ts** — avoids Supabase CLI toolchain dependency.
- **Montserrat via next/font/google** — AAAH Branding/Montserrat/ folder was empty.
- **Tailwind v4 CSS-first colour tokens** — tokens defined in globals.css @theme block.
- **Database types must use type aliases not interfaces** — Supabase GenericTable requires `Row: Record<string, unknown>`.
- **useSession() takes no args** — hook auto-discovers active session via getActiveSession() + Realtime INSERT.
- **createHire guarded by useRef(false)** — prevents duplicate inserts from re-renders; also now has a DB-level session_id check.
- **1500ms auto-advance answer_submitted → question_result** — gives display time to reflect via Realtime.
- **Image answers are EN-only in Supabase** — AR rows use text descriptions; image_url is null for AR.
- **Supabase Storage bucket "question-images" is public** — CDN URLs, no auth.
- **i18n via t(language) typed string map** — no external library.
- **HiredNetworkScreen: JS requestAnimationFrame Lissajous paths** — D3 and CSS keyframe approaches all failed; rAF is definitive.
- **Lissajous period base: 35s** — doubled from original 70s at user request for faster animation.
- **useHires called at display/page level** — avoids duplicate subscriptions.
- **60s inactivity timer → HiredNetworkScreen** — fires after 60s idle/screensaver; resets on any active game state.
- **Header stays in root layout** — display page keeps AAAH header.
- **Supabase lazy-init via Proxy** — prevents `supabaseUrl is required` crash during Vercel static prerendering.
- **Vercel team account domain** — production URL is ruya2026.vercel.app (team project); deployment protection must be disabled or public access is blocked.
- **15s auto-reset on final result** — countdown shown on controller; session resets to idle automatically; display follows via Realtime.
- **Score hidden during quiz** — display QuestionScreen shows question number only; score revealed on final result screen only.
- **Hired network centre** — white AAAH logo + "Our Future Leaders" tagline at 90% opacity.
- **createHire DB guard** — checks for existing hire by session_id before inserting; silent skip if found.
- **useHires triple deduplication** — Realtime INSERT handler checks id, session_id, and player_name+track before appending.

### Deferred Issues

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-08-03
Stopped at: All phases complete. App live and tested.

### Resume steps

No planned work remaining. Next session likely involves:
1. UAT / further polish requests from user
2. Event-day prep (clearing hires, seeding any updated questions)
3. Any last-minute fixes surfaced during rehearsal
