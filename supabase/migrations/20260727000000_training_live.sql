-- Live training room for /training/202607/ (Service → Training)
create table if not exists public.training_students (
  id text primary key,
  session_code text not null,
  name text not null,
  device_id text,
  joined_at double precision not null
);

create table if not exists public.training_events (
  id bigserial primary key,
  student_id text not null references public.training_students(id) on delete cascade,
  session_code text not null,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at double precision not null
);

create index if not exists training_students_session_idx on public.training_students(session_code);
create index if not exists training_events_session_idx on public.training_events(session_code);
create index if not exists training_events_student_idx on public.training_events(student_id);

alter table public.training_students enable row level security;
alter table public.training_events enable row level security;

-- Public workshop access (session codes are the gate on the website)
drop policy if exists training_students_anon_all on public.training_students;
create policy training_students_anon_all on public.training_students
  for all to anon, authenticated using (true) with check (true);

drop policy if exists training_events_anon_all on public.training_events;
create policy training_events_anon_all on public.training_events
  for all to anon, authenticated using (true) with check (true);
