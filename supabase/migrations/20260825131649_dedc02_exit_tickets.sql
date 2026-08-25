-- Name-light DEDC02 exit tickets with a separately protected teacher dashboard.
create extension if not exists pgcrypto;

create table if not exists public.dedc02_exit_tickets (
  id uuid primary key default gen_random_uuid(),
  class_code text not null check (char_length(class_code) between 2 and 40),
  preferred_name text not null check (char_length(preferred_name) between 1 and 60),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists dedc02_exit_tickets_class_created_idx
  on public.dedc02_exit_tickets (class_code, created_at desc);

create table if not exists public.dedc02_dashboard_keys (
  key_name text primary key,
  code_hash text not null check (code_hash ~ '^[0-9a-f]{64}$'),
  updated_at timestamptz not null default now()
);

insert into public.dedc02_dashboard_keys (key_name, code_hash)
values ('teacher', '8b3995f2c87ef33c2119c2e0e65dade160021438f4322d09fa766dc812a21613')
on conflict (key_name) do update
set code_hash = excluded.code_hash,
    updated_at = now();

alter table public.dedc02_exit_tickets enable row level security;
alter table public.dedc02_dashboard_keys enable row level security;

-- The Edge Function performs validation and uses the service role. The Data API
-- exposes neither learner answers nor the teacher key table to browser roles.
revoke all on table public.dedc02_exit_tickets from anon, authenticated;
revoke all on table public.dedc02_dashboard_keys from anon, authenticated;

drop policy if exists "No direct browser access to DEDC02 tickets" on public.dedc02_exit_tickets;
create policy "No direct browser access to DEDC02 tickets"
on public.dedc02_exit_tickets
for all
to anon, authenticated
using (false)
with check (false);

drop policy if exists "No browser access to DEDC02 dashboard keys" on public.dedc02_dashboard_keys;
create policy "No browser access to DEDC02 dashboard keys"
on public.dedc02_dashboard_keys
for all
to anon, authenticated
using (false)
with check (false);
