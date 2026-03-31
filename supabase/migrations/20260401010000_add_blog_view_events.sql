-- Per-blog-post click/view events

create table if not exists public.blog_visit_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  slug text not null references public.blog_posts(slug) on update cascade on delete cascade,
  ip_hash text not null
);

create index if not exists blog_visit_events_slug_idx on public.blog_visit_events (slug);
create index if not exists blog_visit_events_occurred_at_idx on public.blog_visit_events (occurred_at desc);
create index if not exists blog_visit_events_ip_hash_idx on public.blog_visit_events (ip_hash);
create index if not exists blog_visit_events_slug_ip_hash_idx on public.blog_visit_events (slug, ip_hash);

alter table public.blog_visit_events enable row level security;

drop policy if exists "No public read blog visits" on public.blog_visit_events;
create policy "No public read blog visits"
on public.blog_visit_events
for select
to anon, authenticated
using (false);

drop policy if exists "No public write blog visits" on public.blog_visit_events;
create policy "No public write blog visits"
on public.blog_visit_events
for all
to anon, authenticated
using (false)
with check (false);
