-- Kaikki.fi backend schema (Supabase/Postgres)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  price numeric(12,2) not null default 0,
  category text not null,
  city text not null,
  address text,
  description text,
  condition text,
  housing_type text,
  extra jsonb not null default '{}'::jsonb,
  image_urls text[] not null default '{}',
  status text not null default 'active' check (status in ('active','reserved','sold','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "active listings readable" on public.listings for select using (status <> 'hidden' or auth.uid() = user_id);
create policy "users create own listings" on public.listings for insert with check (auth.uid() = user_id);
create policy "users update own listings" on public.listings for update using (auth.uid() = user_id);
create policy "users delete own listings" on public.listings for delete using (auth.uid() = user_id);

insert into storage.buckets (id,name,public) values ('listing-images','listing-images',true) on conflict (id) do nothing;
create policy "public listing images" on storage.objects for select using (bucket_id='listing-images');
create policy "authenticated upload listing images" on storage.objects for insert to authenticated with check (bucket_id='listing-images');
create policy "owners manage listing images" on storage.objects for update to authenticated using (bucket_id='listing-images' and owner_id=auth.uid());
create policy "owners delete listing images" on storage.objects for delete to authenticated using (bucket_id='listing-images' and owner_id=auth.uid());
