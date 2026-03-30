-- Fix blog_posts RLS: allow public SELECT of published posts, block public writes.
-- The original policy "No public write blog posts" used FOR ALL, which also blocks SELECT.

alter table public.blog_posts enable row level security;

-- Keep published-post read open to anon/authenticated
drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
on public.blog_posts
for select
to anon, authenticated
using (published_at is not null and published_at <= now());

-- Remove the overly-broad FOR ALL policy and replace with explicit write blocks
drop policy if exists "No public write blog posts" on public.blog_posts;

drop policy if exists "No public insert blog posts" on public.blog_posts;
create policy "No public insert blog posts"
on public.blog_posts
for insert
to anon, authenticated
with check (false);

drop policy if exists "No public update blog posts" on public.blog_posts;
create policy "No public update blog posts"
on public.blog_posts
for update
to anon, authenticated
using (false)
with check (false);

drop policy if exists "No public delete blog posts" on public.blog_posts;
create policy "No public delete blog posts"
on public.blog_posts
for delete
to anon, authenticated
using (false);

