-- =============================================================================
-- Ruya Careers Fair 2026 — Initial Schema Migration
-- =============================================================================
-- Tables: sessions, questions, hires
-- Note: RLS is intentionally omitted — anon key, event-day-only, no-auth setup.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- SESSIONS
-- One row per active game session (controller + display share this row).
-- ---------------------------------------------------------------------------
create table public.sessions (
  id                  uuid primary key default gen_random_uuid(),
  state               text not null default 'idle' check (state in (
                        'idle', 'language_select', 'avatar_select', 'name_entry',
                        'track_select', 'question_active', 'answer_submitted',
                        'question_result', 'final_result', 'screensaver'
                      )),
  language            text check (language in ('en', 'ar')),
  player_name         text,
  avatar_id           text,
  track               text,
  current_question    int not null default 0,
  score               int not null default 0,
  last_answer         text check (last_answer in ('A', 'B', 'C')),
  last_answer_correct boolean,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sessions_set_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- QUESTIONS
-- All 200 rows (100 EN + 100 AR) seeded in Phase 3.
-- Four questions have image answer options (image_url columns).
-- ---------------------------------------------------------------------------
create table public.questions (
  id                  uuid primary key default gen_random_uuid(),
  track               text not null,
  question_no         int not null,
  language            text not null check (language in ('en', 'ar')),
  question_text       text not null,
  answer_a_text       text,
  answer_a_image_url  text,
  answer_b_text       text,
  answer_b_image_url  text,
  answer_c_text       text,
  answer_c_image_url  text,
  correct_answer      text not null check (correct_answer in ('A', 'B', 'C')),
  created_at          timestamptz not null default now(),
  unique (track, question_no, language)
);

create index questions_track_language_idx on public.questions (track, language);


-- ---------------------------------------------------------------------------
-- HIRES
-- One row per player who scored 7–10 (drives the animated hired network).
-- ---------------------------------------------------------------------------
create table public.hires (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references public.sessions (id) on delete set null,
  player_name text not null,
  avatar_id   text not null,
  track       text not null,
  score       int not null,
  hired_at    timestamptz not null default now()
);

create index hires_track_idx on public.hires (track);


-- ---------------------------------------------------------------------------
-- REALTIME
-- Enable realtime on sessions and hires.
-- questions are read-only after seed — no realtime needed.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.hires;
