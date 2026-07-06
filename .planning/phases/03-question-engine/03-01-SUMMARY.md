---
phase: 03-question-engine
plan: 01
subsystem: database
tags: [supabase, csv, seed, storage, tsx, csv-parse, dotenv]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Supabase client setup, database schema with questions table
provides:
  - 200 question rows in Supabase questions table (100 EN + 100 AR, 10 tracks × 10 questions each)
  - 12 images uploaded to Supabase Storage bucket "question-images"
  - scripts/seed-questions.ts — reusable seed script reading from Question Matrix.csv
affects: [04-controller-ui, 05-player-ui, question engine consumers]

# Tech tracking
tech-stack:
  added: [csv-parse, tsx, dotenv]
  patterns: [CSV-to-database seeding via tsx script, image upload via Supabase Storage SDK, UTF-8 BOM stripping, image path detection via C:\ prefix, answer dual-type (text OR image_url)]

key-files:
  created: [scripts/seed-questions.ts, .env.local.example]
  modified: [package.json, package-lock.json]

key-decisions:
  - "Image answers detected by C:\\ prefix in CSV answer fields — Windows absolute paths indicate image files"
  - "Arabic image-question rows (Q6/Q9/Q4) use Arabic text answers, not image paths — images are EN-only"
  - "Storage bucket 'question-images' is public — images served via direct Supabase Storage CDN URLs"
  - "Image upload uses upsert: true — script is idempotent, safe to re-run"
  - "Delete-all before insert (neq impossible UUID) — ensures clean slate on each seed run"
  - "SUPABASE_SERVICE_ROLE_KEY required for storage ops — excluded from git, documented in .env.local.example"

patterns-established:
  - "tsx scripts: run directly via npx tsx scripts/foo.ts without compilation step"
  - "dotenv loaded via dotenv.config({ path: '.env.local' }) at script top"
  - "Image URL cache: Map<string, string> prevents re-uploading same image for EN/AR row pairs"

issues-created: []

# Metrics
duration: 15min
completed: 2026-07-06
---

# Plan 03-01: Question Seed Summary

**200 questions and 12 answer images seeded to Supabase from Question Matrix.csv via a typed tsx seed script**

## Performance

- **Duration:** ~15 min (including human-action checkpoint for SUPABASE_SERVICE_ROLE_KEY)
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 2 (+ 1 human-action checkpoint)
- **Files modified:** 4 (scripts/seed-questions.ts, .env.local.example, package.json, package-lock.json)

## Accomplishments
- Seed script parses 200 CSV rows (UTF-8 BOM stripped), normalizes 10 track names, detects EN/AR language from track suffix
- 12 images uploaded to Supabase Storage bucket "question-images" — Architecture & Design Q6 (3 JPG), Legal & Compliance Q6 (3 PNG), Marketing Q9 (3 PNG), Operations & Supply Chain Q4 (3 PNG)
- English image-answer rows store public CDN URL in `answer_X_image_url`; Arabic counterparts store descriptive text in `answer_X_text`
- Script is idempotent: delete-all before insert, upsert on image upload, URL cache avoids re-uploads

## Task Commits

1. **Task 1: Install deps and create seed script** - `8aded1a` (feat)
2. **Task 2: Run seed script and verify 200 rows** - runtime only (no file changes; data committed to Supabase)
3. **Task 3: SUMMARY.md + STATE.md** - this commit (docs)

## Files Created/Modified
- `scripts/seed-questions.ts` - Full seed pipeline: CSV parse → image upload → batch insert to Supabase
- `.env.local.example` - Added SUPABASE_SERVICE_ROLE_KEY placeholder
- `package.json` / `package-lock.json` - Added csv-parse, tsx, dotenv as devDependencies

## Decisions Made
- Arabic image-question rows (Q6/Q9/Q4) have Arabic text in CSV answer fields, not image paths — plan correctly identified this; no images uploaded for AR rows
- `SUPABASE_SERVICE_ROLE_KEY` uses the new `sb_secret_...` key format — Supabase `createClient` accepts it without issues

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- All 200 questions are in Supabase and accessible via the anon key
- `getQuestionsForTrack(track, language)` loader (from plan 03-02) can now return real data
- Controller UI (Phase 4) can begin — questions table is populated and typed
- Image URLs are public CDN URLs — no auth needed to display answer images in the player UI

---
*Phase: 03-question-engine*
*Completed: 2026-07-06*
