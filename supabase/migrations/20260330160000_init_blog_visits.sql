-- Blog posts (public read) + Visits events (server-side insert only)

create extension if not exists pgcrypto;

-- BLOG
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_md text not null,
  cover_image_url text,
  tags text[] not null default '{}'::text[],
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc nulls last);
create index if not exists blog_posts_tags_gin_idx on public.blog_posts using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

-- VISITS
create table if not exists public.visit_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  ip_hash text not null,
  country text,
  region text,
  city text,
  lat double precision,
  lng double precision
);

create index if not exists visit_events_occurred_at_idx on public.visit_events (occurred_at desc);
create index if not exists visit_events_country_region_idx on public.visit_events (country, region);
create index if not exists visit_events_ip_hash_idx on public.visit_events (ip_hash);

-- RLS
alter table public.blog_posts enable row level security;
alter table public.visit_events enable row level security;

-- Public can read published posts (published_at not null and in past)
drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
on public.blog_posts
for select
to anon, authenticated
using (published_at is not null and published_at <= now());

-- No public inserts/updates/deletes by default
drop policy if exists "No public write blog posts" on public.blog_posts;
create policy "No public write blog posts"
on public.blog_posts
for all
to anon, authenticated
using (false)
with check (false);

-- Visits: allow select only to service role (edge function) by keeping it locked down
drop policy if exists "No public read visits" on public.visit_events;
create policy "No public read visits"
on public.visit_events
for select
to anon, authenticated
using (false);

drop policy if exists "No public write visits" on public.visit_events;
create policy "No public write visits"
on public.visit_events
for all
to anon, authenticated
using (false)
with check (false);

