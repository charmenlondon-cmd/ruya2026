# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-03)

**Core value:** Stunning display + reliable realtime sync + animated hired network + smooth bilingual player experience
**Current focus:** Phase 2 — Realtime Game Engine

## Current Position

Phase: 2 of 7 (Realtime Game Engine)
Plan: 2 of ? in current phase (02-02 tasks complete, awaiting checkpoint:human-verify)
Status: In progress — PAUSED at checkpoint
Last activity: 2026-07-03 — Plan 02-02 tasks 1+2 executed (controller and display scaffolds); checkpoint:human-verify pending

Progress: ████░░░░░░ 45%

## Performance Metrics

**Velocity:**
- Total plans completed: 4
- Average duration: 20 min
- Total execution time: 1.43 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/3 | 52 min | 17 min |
| 02-realtime-game-engine | 1/? | 35 min | 35 min |
| 02-02 (partial) | tasks 1-2 of 3 | 15 min | — |

**Recent Trend:**
- Last 5 plans: 01-01 (15 min), 01-02 (12 min), 01-03 (25 min), 02-01 (35 min), 02-02 tasks (~15 min)
- Trend: 02-01 longer due to TypeScript interface/type compatibility investigation; 02-02 very fast — just wired components

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

### Deferred Issues

None yet.

### Blockers/Concerns

**BLOCKING: Supabase project not yet created.**

Plan 02-02 is paused at `checkpoint:human-verify` because there is no live Supabase project yet. The migration SQL and typed client are written and committed, but have never been run against a real database. `.env.local` does not exist.

## Session Continuity

Last session: 2026-07-03
Stopped at: Plan 02-02 checkpoint:human-verify (Tasks 1+2 done, awaiting Supabase setup + realtime sync verification)

### Resume steps for Monday

**Step 1 — Create Supabase project (one-time, ~5 min)**
1. Go to supabase.com → New project
2. Note your **Project URL** and **anon public key** (Settings → API)
3. Open the SQL Editor, paste contents of `supabase/migrations/001_initial_schema.sql`, and run it

**Step 2 — Wire credentials**
```bash
cp .env.local.example .env.local
# then edit .env.local and fill in real values:
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Step 3 — Verify realtime sync**
```bash
npm run dev
```
- Tab 1: `http://localhost:3000/controller` — click "Next State →"
- Tab 2: `http://localhost:3000/display` — should mirror within ~1 second

**Step 4 — Resume execution**
Once verified, reply `approved` to the checkpoint prompt and run:
```
/gsd:execute-phase 2
```
It will detect 02-01 complete, skip it, and resume 02-02 from the checkpoint.
