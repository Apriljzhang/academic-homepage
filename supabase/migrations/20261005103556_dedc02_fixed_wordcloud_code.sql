-- Use the course code as the fixed student word-cloud session code.
alter table public.dedc02_ethics_cloud_sessions
  drop constraint if exists dedc02_ethics_cloud_sessions_session_code_check;

alter table public.dedc02_ethics_cloud_sessions
  add constraint dedc02_ethics_cloud_sessions_session_code_check
  check (session_code ~ '^[A-Z0-9]{6}$');

insert into public.dedc02_ethics_cloud_sessions (session_code, expires_at)
values ('DEDC02', now() + interval '30 days')
on conflict (session_code) do update
set expires_at = greatest(public.dedc02_ethics_cloud_sessions.expires_at, excluded.expires_at);
