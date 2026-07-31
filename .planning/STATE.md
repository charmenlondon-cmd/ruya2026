# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** Phase 6 — Hired Network

## Current Position

Phase: 6 of 7 (Hired Network)
Plan: 1 of ? in current phase — COMPLETE (CSS constellation approach, human checkpoint pending)
Status: CHECKPOINT — 06-01 complete with CSS constellation approach. D3 removed; HiredNetworkScreen built as pure CSS floating cards with seeded stable positions. 60s inactivity timer in display/page.tsx switches screensaver to hired network. Awaiting human visual QA.
Last activity: 2026-07-31 — 06-01: D3 scrapped, CSS constellation HiredNetworkScreen built, 1-minute timer added; paused at checkpoint:human-verify

Progress: █████████████████ ~80%

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: ~20 min
- Total execution time: ~2.7 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/3 | 52 min | 17 min |
| 02-realtime-game-engine | 2/2 | 50 min | 25 min |
| 03-question-engine | 2/2 | ~25 min | ~12 min |
| 04-controller-ui | 3/3 | ~60 min | ~20 min |
| 05-display-screen | 3/3 | ~55 min | ~18 min |

**Recent Trend:**
- Last 5 plans: 04-03 (~20 min), 05-01 (~10 min), 05-02 (~10 min), 05-03 (~35 min)
- Trend: plans remain fast when tasks are code-generation rather than investigation

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **package.json name is `ruya-careers-fair-2026`** — directory name "Ruya Careers Fair 2026" violates npm naming rules; the npm package name must differ from the OS directory name. This is fine — they don't need to match.
- **Temp directory workaround for create-next-app** — future plans that need to add npm packages should just `npm install` in the project directory directly; no workaround needed for package installs.
- **RLS omitted from schema** — anon key, event-day-only, no-auth setup. Enable RLS only if security requirements change.
- **questions excluded from realtime publication** — read-only after seed; no realtime needed on that table.
- **Manual TypeScript types in src/types/database.ts** — avoids Supabase CLI toolchain dependency; types are explicit and reviewable.
- **.env.local.example force-committed** — .env* gitignore pattern would exclude it; force-added since it holds only placeholder values.
- **Montserrat via next/font/google** — AAAH Branding/Montserrat/ folder was empty; Google Fonts via Next.js is the correct approach.
- **Tailwind v4 CSS-first colour tokens** — No tailwind.config.ts extension needed; tokens defined in globals.css @theme block become utility classes automatically.
- **CSS body override removed** — Default create-next-app globals.css had body{background} and body{font-family} that overrode the branded gradient and Montserrat; removed in 01-03.
- **Database types must use type aliases not interfaces** — TypeScript `interface` does not extend `Record<string, unknown>`; Supabase's `GenericTable` requires `Row: Record<string, unknown>`. Use `type Session = {...}` not `interface Session`. Discovered in 02-01.
- **Database type requires Relationships/Views/Functions** — The Supabase client's `GenericSchema` constraint requires each table to have `Relationships: GenericRelationship[]` and the schema to have `Views` and `Functions` fields. Without them, `from().insert()` and `from().update()` resolve to `never`. Added in 02-01.
- **Session CRUD: full insert payload required** — `Insert` type is `Omit<Session, 'id' | 'created_at' | 'updated_at'>` requiring all non-omitted fields. DB defaults handle `id`/timestamps; application code must supply all other fields explicitly.
- **useSession() takes no args** — hook auto-discovers active session via `getActiveSession()` + Realtime INSERT event. Both controller and display use it identically.
- **Controller creates session on mount; display subscribes independently** — No prop-drilling needed; Realtime INSERT event propagates new session to display hook automatically.
- **getQuestionsForTrack: no caching/retry in loader** — Caching, retry, and prefetch belong in the consumer hooks (Phase 4/5), not in the data-access function. Loader is intentionally thin: one query, typed return, throw on error.
- **createHire guarded by useRef(false)** — FinalResultScreen calls createHire once on mount; useRef prevents duplicate inserts from React strict mode double-fires or re-renders.
- **answered local state disables buttons on tap** — Prevents double-taps before Supabase responds; reset on current_question change.
- **1500ms auto-advance answer_submitted → question_result** — Gives display screen time to reflect submitted state via Realtime before advancing.
- **Image answers are EN-only in Supabase** — Arabic counterparts of the 4 image questions (Architecture & Design Q6, Legal & Compliance Q6, Marketing Q9, Operations & Supply Chain Q4) store Arabic text descriptions in answer_X_text; answer_X_image_url is null for AR rows.
- **Supabase Storage bucket "question-images" is public** — Images served via CDN URLs with no auth. Safe for event-day use.
- **Seed script is idempotent** — Delete-all before insert + upsert on image upload; safe to re-run if data needs refreshing.
- **i18n via t(language) typed string map** — No external library; t(language).key pattern is compile-time safe, tree-shakeable, and keeps components pure/testable. Established in 04-03.
- **dir applied once to controller page wrapper** — Single HTML attribute cascades RTL to all child components automatically; no per-component direction handling needed. Established in 04-03.
- **StartOverButton shared component, not inlined** — Full reset payload lives in one place; all 7 screens import the component and pass session + language. Ghost button positioned absolute top-right inside a relative wrapper. Established in 04-03.
- **LanguageSelectScreen buttons stay bilingual by design** — "English" and "العربية" labels are hardcoded, not localised — they are the selector itself and must always show both languages regardless of current session language. Established in 04-03.
- **Display QuestionScreen answer grid forced dir=ltr** — A/B/C columns are visual (not textual flow); forcing LTR prevents RTL parent from flipping the column order in Arabic sessions. Established in 05-01.
- **Display page idle/screensaver placeholder is hardcoded English** — Inline placeholder only; will be replaced in 05-03 (screensaver plan) with the full bilingual screensaver. Established in 05-01.
- **Display FinalResultScreen: track null-guarded** — `session.track` is `Track | null`; the track line only renders when track is non-null to avoid a bad `trackName(null)` call. Established in 05-02.
- **FinalResultScreen pulsing ring inside relative wrapper** — `animate-ping` ring is absolutely positioned inside a `relative` div wrapping the avatar Image; this ties ring dimensions to avatar without affecting surrounding flex layout. Established in 05-02.
- **ScreensaverScreen float via inline `<style>` keyframe** — CSS-only, no Framer Motion; Tailwind v4 arbitrary keyframe syntax is verbose; inline style tag is simpler. Established in 05-03.
- **ScreensaverScreen z-layer: glow z-0, content z-10** — No D3 canvas layer needed; HiredNetworkScreen is a separate full-screen component rendered instead of ScreensaverScreen. Established in 05-03 (revised 06-01).
- **HiredNetworkScreen: CSS constellation not D3** — D3 force simulation produced random bobbing; pure CSS @keyframes float with seeded stable positions gives a clean constellation. Established in 06-01.
- **seedFromId() hash for stable node positions** — Deterministic position derived from hire.id; no Math.random() so positions don't jump on re-render. Established in 06-01.
- **Negative animationDelay on float** — All nodes appear already mid-motion on mount; avoids all-nodes-start-simultaneously effect. Established in 06-01.
- **useHires called at display/page level** — Data fetched once, passed as prop to HiredNetworkScreen; avoids duplicate subscriptions across screen switches. Established in 06-01.
- **60s timer resets on any active game state** — showHiredNetwork flips false immediately when session enters a game state; user always sees ScreensaverScreen first after game ends. Established in 06-01.
- **useHires errors silently ignored** — Empty array is safe fallback; the hired network screen shows empty state without crashing. Established in 06-01.

### Deferred Issues

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-07-31
Stopped at: 06-01 checkpoint:human-verify. CSS constellation approach complete. Awaiting user to run `npm run dev`, visit /display, wait 60s in idle/screensaver state, and confirm floating hire cards appear.

### Resume steps

After human approves: proceed to 06-02 (Realtime subscription for live hire updates).
