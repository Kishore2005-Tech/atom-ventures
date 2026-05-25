-- Atom Ventures: schema + RLS + signup trigger
-- Run this script once. Safe to re-run (idempotent).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null check (role in ('founder','investor','admin')) default 'founder',
  bio text,
  company text,
  interests text[] default '{}',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  industry text not null,
  problem text not null,
  solution text not null,
  pitch text not null,
  funding_required numeric not null default 0,
  team_details text,
  pitch_deck_url text,
  status text not null check (status in ('pending','approved','rejected')) default 'pending',
  ai_score int,
  market_demand_score int,
  risk_level text check (risk_level in ('low','medium','high')),
  spam_probability int,
  ai_recommendations text,
  ai_improvements text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.startups enable row level security;
drop policy if exists "startups_select_visible" on public.startups;
drop policy if exists "startups_insert_founder" on public.startups;
drop policy if exists "startups_update_owner_or_admin" on public.startups;
drop policy if exists "startups_delete_owner" on public.startups;
create policy "startups_select_visible" on public.startups for select using (
  founder_id = auth.uid()
  or status = 'approved'
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "startups_insert_founder" on public.startups for insert with check (founder_id = auth.uid());
create policy "startups_update_owner_or_admin" on public.startups for update using (
  founder_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "startups_delete_owner" on public.startups for delete using (founder_id = auth.uid());

create table if not exists public.investor_interests (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references auth.users(id) on delete cascade,
  startup_id uuid not null references public.startups(id) on delete cascade,
  type text not null check (type in ('like','save','contact')),
  created_at timestamptz default now(),
  unique (investor_id, startup_id, type)
);
alter table public.investor_interests enable row level security;
drop policy if exists "interests_select_own_or_founder" on public.investor_interests;
drop policy if exists "interests_insert_own" on public.investor_interests;
drop policy if exists "interests_delete_own" on public.investor_interests;
create policy "interests_select_own_or_founder" on public.investor_interests for select using (
  investor_id = auth.uid()
  or exists (select 1 from public.startups s where s.id = startup_id and s.founder_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "interests_insert_own" on public.investor_interests for insert with check (investor_id = auth.uid());
create policy "interests_delete_own" on public.investor_interests for delete using (investor_id = auth.uid());

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid references public.startups(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
drop policy if exists "messages_select_participants" on public.messages;
drop policy if exists "messages_insert_sender" on public.messages;
create policy "messages_select_participants" on public.messages for select using (
  sender_id = auth.uid() or recipient_id = auth.uid()
);
create policy "messages_insert_sender" on public.messages for insert with check (sender_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'founder')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
