-- RDA Memory Architecture
-- Apply to the Supabase/Postgres project designated for RDA.
-- Do not apply to unrelated simulation databases.

create extension if not exists pgcrypto;

create table if not exists rda_working_memory (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  user_id text,
  goal text,
  context_summary text not null default '',
  constraints jsonb not null default '[]'::jsonb,
  rejected_options jsonb not null default '[]'::jsonb,
  unresolved_questions jsonb not null default '[]'::jsonb,
  pathway_state jsonb not null default '{}'::jsonb,
  last_query text,
  last_answer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create index if not exists rda_working_memory_user_id_idx
  on rda_working_memory(user_id);
create index if not exists rda_working_memory_expires_at_idx
  on rda_working_memory(expires_at);

create table if not exists rda_user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  category text not null,
  memory_key text not null,
  fact text not null,
  structured_value jsonb,
  provenance text not null check (provenance in (
    'user_stated',
    'user_confirmed',
    'assistant_delegated',
    'derived_confirmed'
  )),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  sensitivity text not null default 'standard' check (sensitivity in (
    'standard', 'sensitive', 'highly_sensitive'
  )),
  active boolean not null default true,
  supersedes_id uuid references rda_user_memory(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_confirmed_at timestamptz,
  review_at timestamptz,
  expires_at timestamptz,
  unique(user_id, category, memory_key, active)
);

create index if not exists rda_user_memory_user_active_idx
  on rda_user_memory(user_id, active);
create index if not exists rda_user_memory_review_idx
  on rda_user_memory(review_at)
  where active = true;

create table if not exists rda_memory_events (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  session_id text,
  memory_id uuid,
  event_type text not null,
  actor_type text not null default 'system',
  actor_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rda_memory_events_user_idx
  on rda_memory_events(user_id, created_at desc);
create index if not exists rda_memory_events_session_idx
  on rda_memory_events(session_id, created_at desc);

-- RLS should be enabled before exposing direct browser access.
-- Initial implementation accesses these tables only from trusted server code.
alter table rda_working_memory enable row level security;
alter table rda_user_memory enable row level security;
alter table rda_memory_events enable row level security;

-- No permissive client policies are created here intentionally.
-- Server-side service credentials may access the tables; browser clients should not.
