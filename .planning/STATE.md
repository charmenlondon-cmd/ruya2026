# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** Phase 4 — Controller UI

## Current Position

Phase: 4 of 7 (Controller UI)
Plan: 3 of 3 in current phase — paused at human-verify checkpoint
Status: Plan 04-03 Task 1 complete (adc4b02) — Arabic RTL wired; awaiting human verification of Arabic flow
Last activity: 2026-07-31 — i18n.ts created; all 7 screens updated with language prop and bilingual strings; dir="rtl" wired to controller page wrapper

Progress: █████████░ 90%

## Performance Metrics

**Velocity:**
- Total plans completed: 4
- Average duration: 20 min
- Total execution time: 1.43 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/3 | 52 min | 17 min |
| 02-realtime-game-engine | 2/2 | 50 min | 25 min |
| 03-question-engine | 2/2 | ~25 min | ~12 min |
| 04-controller-ui | 2/3 | ~35 min | ~17 min |

**Recent Trend:**
- Last 5 plans: 01-03 (25 min), 02-01 (35 min), 02-02 tasks (~15 min), 03-01 (seed), 04-01 (~15 min)
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
- **LanguageSelectScreen buttons stay bilingual by design** — "English" and "العربية" labels are hardcoded, not localised — they are the selector itself and must always show both languages regardless of current session language. Established in 04-03.

### Deferred Issues

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-07-31
Stopped at: Phase 4, Plan 03, Task 2 (human-verify checkpoint). Task 1 complete (adc4b02): i18n.ts created, all 7 controller screens bilingual, dir="rtl" wired. Awaiting human verification of Arabic flow in browser.

### Resume steps

After user approves Arabic flow: plan 04-03 is complete, phase 04 is complete. Execute phase 05 (Display Screen).
