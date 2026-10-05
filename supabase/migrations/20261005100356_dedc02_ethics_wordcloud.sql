-- Anonymous, short-text responses for one Research Ethics and Integrity class session.
create table public.dedc02_ethics_cloud_sessions (
  session_code text primary key check (session_code ~ '^[A-Z2-9]{6}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

create table public.dedc02_ethics_cloud_words (
  id bigint generated always as identity primary key,
  session_code text not null references public.dedc02_ethics_cloud_sessions(session_code) on delete cascade,
  term text not null check (char_length(term) between 1 and 40),
  created_at timestamptz not null default now()
);

create index dedc02_ethics_cloud_words_session_idx
  on public.dedc02_ethics_cloud_words (session_code, created_at);

alter table public.dedc02_ethics_cloud_sessions enable row level security;
alter table public.dedc02_ethics_cloud_words enable row level security;

-- Browser clients use only the validated Edge Function; there is no Data API access.
revoke all on table public.dedc02_ethics_cloud_sessions from anon, authenticated;
revoke all on table public.dedc02_ethics_cloud_words from anon, authenticated;
revoke all on sequence public.dedc02_ethics_cloud_words_id_seq from anon, authenticated;

insert into public.dedc02_dashboard_keys (key_name, code_hash)
values ('ethics_wordcloud', '9d4fb5c1cbceddffcf1fe26e35d574b6181ad35af29edb9c9355936435d53140')
on conflict (key_name) do update
set code_hash = excluded.code_hash,
    updated_at = now();
