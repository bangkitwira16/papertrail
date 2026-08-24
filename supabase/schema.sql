create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  id text primary key,
  name text not null,
  email text unique not null,
  initials text not null,
  color text not null
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  content text not null default '<p></p>',
  owner_id text not null references public.app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_shares (
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id text not null references public.app_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (document_id, user_id)
);

insert into public.app_users (id, name, email, initials, color) values
  ('user-alex', 'Alex Morgan', 'alex@papertrail.test', 'AM', '#396246'),
  ('user-maya', 'Maya Chen', 'maya@papertrail.test', 'MC', '#8b5e4a'),
  ('user-sam', 'Sam Rivera', 'sam@papertrail.test', 'SR', '#4a628b')
on conflict (id) do update set name = excluded.name, email = excluded.email, initials = excluded.initials, color = excluded.color;

alter table public.app_users enable row level security;
alter table public.documents enable row level security;
alter table public.document_shares enable row level security;

-- The app uses a server-only service-role key. No public Data API policies are required.
