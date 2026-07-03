---
phase: 02-realtime-game-engine
plan: 01
subsystem: database
tags: [supabase, realtime, react, typescript, hooks]

requires:
  - phase: 01-foundation
    provides: Supabase client singleton (src/lib/supabase.ts) and typed Database schema (src/types/database.ts)

provides:
  - src/lib/session.ts — getActiveSession, createSession, updateSession CRUD functions
  - src/hooks/useSession.ts — live-updating React hook with Supabase Realtime subscription

affects: [04-controller, 05-display, 07-hired-wall]

tech-stack:
  added: []
  patterns:
    - Session CRUD centralised through updateSession — all state transitions use this one function
    - useRef to avoid stale closure in Realtime handler
    - 'use client' hook pattern for Supabase Realtime subscriptions

key-files:
  created:
    - src/lib/session.ts
    - src/hooks/useSession.ts
  modified:
    - src/types/database.ts

key-decisions:
  - "Converted interface Session/Question/Hire to type aliases — TypeScript interfaces do not satisfy Record<string, unknown> constraint required by Supabase's GenericTable type, causing from().insert()/update() to resolve as never"
  - "Added Relationships: never[], Views, Functions fields to Database type — required by Supabase client's GenericSchema constraint for schema resolution"
  - "Full insert payload with all fields (nulls for optional) — Insert type requires all non-omitted fields; DB defaults handle timestamps and id"
  - "useRef to track current session in Realtime handler — avoids stale closure without adding session to useEffect dependency array"

patterns-established:
  - "Pattern: Supabase Database types must use type aliases (not interfaces) for Row/Insert/Update to satisfy GenericTable constraint"
  - "Pattern: Database type requires Relationships: never[], Views, Functions fields for Supabase client schema resolution"
  - "Pattern: Realtime handlers use sessionRef.current for stale closure safety"

issues-created: []

duration: 35min
completed: 2026-07-03
---

# Phase 02-01: Session Engine Summary

**Supabase session CRUD layer (session.ts) and live-updating React hook (useSession.ts) with postgres_changes Realtime subscription**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `src/lib/session.ts` with three exported async functions covering all session state transitions
- Created `src/hooks/useSession.ts` with Supabase Realtime subscription and stale-closure-safe ref pattern
- Fixed `src/types/database.ts` to satisfy Supabase client's `GenericSchema` TypeScript constraint (root cause: interfaces vs type aliases)

## Task Commits

1. **Task 1: session CRUD + Database type fix** — `77db512` (feat)
2. **Task 2: useSession hook** — `d763f25` (feat)

## Files Created/Modified

- `src/lib/session.ts` — getActiveSession, createSession, updateSession wrapping the shared Supabase singleton
- `src/hooks/useSession.ts` — 'use client' hook: loads session on mount, subscribes to postgres_changes, returns { session, loading, error }
- `src/types/database.ts` — Converted Session/Question/Hire from interface to type; added Relationships/Views/Functions to satisfy Supabase GenericSchema

## Decisions Made

- **interface → type aliases for Session/Question/Hire:** TypeScript's structural subtyping does not allow `interface` types to extend `Record<string, unknown>`. The Supabase `GenericTable` requires `Row: Record<string, unknown>`, so using `interface` causes `from().insert()` to resolve as `never`. Switching to `type =` aliases fixes this.
- **Full insert payload (all fields with null defaults):** The `Insert` type is `Omit<Session, 'id' | 'created_at' | 'updated_at'>` which requires all remaining fields. The plan's suggestion to insert only `{ state: 'idle' }` is valid at the DB level but not TypeScript-safe without the full payload.
- **useRef for stale closure avoidance:** Using `sessionRef.current` inside the Realtime handler prevents stale captures without making `session` a dependency of the setup `useEffect`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Database type interfaces don't satisfy Supabase GenericSchema constraint**
- **Found during:** Task 1 (TypeScript verification with `npx tsc --noEmit`)
- **Issue:** `interface Session/Question/Hire` don't extend `Record<string, unknown>`, causing `Database['public']` to not extend `GenericSchema`, so `supabase.from('sessions').insert()` resolved parameter as `never[]`
- **Fix:** Converted all three data interfaces to `type` aliases; added `Relationships: never[]` to each table; added `Views` and `Functions` fields to `Database.public`
- **Files modified:** `src/types/database.ts`
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** `77db512` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (blocking TypeScript compatibility issue), 0 deferred
**Impact on plan:** Necessary fix — without it the session CRUD functions would have TypeScript errors and the hook couldn't be typed correctly. No scope creep.

## Issues Encountered

- Supabase JS v2.110.0 requires a stricter `GenericSchema` contract than the original `database.ts` provided. The `interface` keyword in TypeScript does not extend `Record<string, unknown>` due to excess property checking rules in strict mode. This is a known TypeScript behaviour difference between `interface` and `type` aliases.

## Next Phase Readiness

- `getActiveSession`, `createSession`, `updateSession` are ready for import by Phase 4 (controller) and Phase 5 (display)
- `useSession()` hook is ready for use in any client component needing live session state
- No blockers for subsequent plans in Phase 02

---
*Phase: 02-realtime-game-engine*
*Completed: 2026-07-03*
