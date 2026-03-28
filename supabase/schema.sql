-- Musa Database Schema
-- Run this in Supabase SQL Editor

-- Clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  segment text not null,
  brand_voice text default '',
  target_audience text default '',
  platforms text[] default '{"instagram"}',
  preferred_formats text[] default '{"reels"}',
  notes text default '',
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- Briefs
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  raw_briefing text not null,
  decoded_result jsonb not null,
  created_at timestamptz default now()
);

-- Copy History
create table if not exists copy_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  module text not null default 'musa',
  prompt text not null,
  result jsonb not null,
  copy_type text,
  tone text,
  platform text not null,
  created_at timestamptz default now()
);

-- Activities
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  client_id uuid references clients(id) on delete set null,
  module text not null,
  created_at timestamptz default now()
);

-- Calendar Entries
create table if not exists calendar_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  title text not null,
  platform text not null,
  format text default 'reels',
  scheduled_date date not null,
  status text default 'rascunho' check (status in ('rascunho', 'agendado', 'publicado')),
  notes text default '',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_briefs_created_at on briefs(created_at desc);
create index if not exists idx_copy_history_created_at on copy_history(created_at desc);
create index if not exists idx_activities_created_at on activities(created_at desc);
create index if not exists idx_calendar_entries_date on calendar_entries(scheduled_date);

-- RLS (permissive for MVP — no auth)
alter table clients enable row level security;
alter table briefs enable row level security;
alter table copy_history enable row level security;
alter table activities enable row level security;
alter table calendar_entries enable row level security;

create policy "Allow all on clients" on clients for all using (true) with check (true);
create policy "Allow all on briefs" on briefs for all using (true) with check (true);
create policy "Allow all on copy_history" on copy_history for all using (true) with check (true);
create policy "Allow all on activities" on activities for all using (true) with check (true);
create policy "Allow all on calendar_entries" on calendar_entries for all using (true) with check (true);
