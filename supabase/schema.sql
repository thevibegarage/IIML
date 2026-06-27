-- Run this in the Supabase SQL Editor

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) > 0),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Allow public read access on tasks"
  on public.tasks for select
  using (true);

create policy "Allow public insert on tasks"
  on public.tasks for insert
  with check (true);

create policy "Allow public update on tasks"
  on public.tasks for update
  using (true)
  with check (true);

create policy "Allow public delete on tasks"
  on public.tasks for delete
  using (true);
