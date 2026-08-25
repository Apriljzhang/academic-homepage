-- Replace the teacher dashboard access-code hash. The readable code is never stored.
insert into public.dedc02_dashboard_keys (key_name, code_hash)
values ('teacher', 'fc2aee9cda0be3ad22ef2b1f6e6a24adaa8f12abef7978691cb9bd564f82bee9')
on conflict (key_name) do update
set code_hash = excluded.code_hash,
    updated_at = now();
