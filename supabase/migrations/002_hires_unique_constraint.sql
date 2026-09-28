-- =============================================================================
-- Ruya Careers Fair 2026 — Hires uniqueness constraint
-- =============================================================================
-- Applied live on 2026-09-28 via the Supabase Management API during the
-- event, after repeated duplicate hire rows were traced to multiple
-- concurrent writers (stray open controller tabs) racing an app-level
-- check-then-insert guard, which is inherently non-atomic. This constraint
-- makes a duplicate structurally impossible at the database level,
-- regardless of how many callers try to write the same game's result at
-- once. src/lib/hires.ts's createHire() now upserts with
-- onConflict: 'session_id,player_name,avatar_id,track,score',
-- ignoreDuplicates: true to match.
--
-- Tradeoff accepted: this also treats a genuine second win by the same
-- player (same name, avatar, track, AND score, on the same lane) as a
-- duplicate. Considered negligible for a one-play careers-fair quiz.
-- =============================================================================

alter table public.hires
  add constraint hires_unique_game
  unique (session_id, player_name, avatar_id, track, score);
