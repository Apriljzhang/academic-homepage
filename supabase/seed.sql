-- Optional seed data for local dev
insert into public.blog_posts (slug, title, excerpt, content_md, tags, published_at)
values
(
  'welcome',
  'Welcome',
  'A short welcome post.',
  '# Welcome\n\nThis is a starter post. Edit or delete it from the blog admin page.',
  array['teaching','research'],
  now()
)
on conflict (slug) do nothing;

