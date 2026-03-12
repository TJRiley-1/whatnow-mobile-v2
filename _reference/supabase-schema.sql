<details>
<summary>Click to see the SQL code to copy</summary>
```sql
-- What Now? Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- Users table (extends Supabase auth.users)
create table public.profiles (
id uuid references auth.users on delete cascade primary key,
email text,
display_name text,
avatar_url text,
total_points integer default 0,
total_tasks_completed integer default 0,
total_time_spent integer default 0, -- minutes
current_rank text default 'Task Newbie',
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Tasks table
create table public.tasks (
id uuid default uuid_generate_v4() primary key,
user_id uuid references public.profiles on delete cascade not null,
local_id text, -- original localStorage ID for sync
name text not null,
description text,
type text not null,
time integer not null, -- minutes
social text not null, -- low, medium, high
energy text not null, -- low, medium, high
due_date date,
recurring text, -- none, daily, weekly, monthly
times_shown integer default 0,
times_skipped integer default 0,
times_completed integer default 0,
points_earned integer default 0,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
constraint tasks_user_local_unique unique (user_id, local_id)
);
-- Completed tasks history
create table public.completed_tasks (
id uuid default uuid_generate_v4() primary key,
user_id uuid references public.profiles on delete cascade not null,
task_name text not null,
task_type text not null,
points integer not null,
time_spent integer, -- minutes, nullable
task_time integer, -- estimated minutes
task_social text, -- low, medium, high
task_energy text, -- low, medium, high
completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Groups table
create table public.groups (
id uuid default uuid_generate_v4() primary key,
name text not null,
description text,
invite_code text unique not null,
created_by uuid references public.profiles on delete set null,
created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Group members junction table
create table public.group_members (
id uuid default uuid_generate_v4() primary key,
group_id uuid references public.groups on delete cascade not null,
user_id uuid references public.profiles on delete cascade not null,
joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
unique(group_id, user_id)
);
-- Leaderboard view (weekly points)
create or replace view public.weekly_leaderboard as
select
p.id as user_id,
p.display_name,
p.avatar_url,
p.current_rank,
coalesce(sum(ct.points), 0) as weekly_points,
count(ct.id) as weekly_tasks,
gm.group_id
from public.profiles p
left join public.completed_tasks ct on ct.user_id = p.id
and ct.completed_at > now() - interval '7 days'
left join public.group_members gm on gm.user_id = p.id
group by p.id, p.display_name, p.avatar_url, p.current_rank, gm.group_id;
alter view public.weekly_leaderboard set (security_invoker = on);
-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.completed_tasks enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
-- Profiles: users can view own profile or group members' profiles
create policy "Users can view profiles" on public.profiles
for select using (
(select auth.uid()) = id
or id in (
select gm.user_id from public.group_members gm
where gm.group_id in (select public.get_user_group_ids((select auth.uid())))
)
);
create policy "Users can update own profile" on public.profiles
for update using ((select auth.uid()) = id);
create policy "Users can insert own profile" on public.profiles
for insert with check ((select auth.uid()) = id);
-- Tasks: users can only access their own tasks
create policy "Users can view own tasks" on public.tasks
for select using ((select auth.uid()) = user_id);
create policy "Users can insert own tasks" on public.tasks
for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own tasks" on public.tasks
for update using ((select auth.uid()) = user_id);
create policy "Users can delete own tasks" on public.tasks
for delete using ((select auth.uid()) = user_id);
-- Completed tasks: users can view own or group members' completed tasks
create policy "Users can view own or group members completed" on public.completed_tasks
for select using (
(select auth.uid()) = user_id
or user_id in (
select gm.user_id from public.group_members gm
where gm.group_id in (select public.get_user_group_ids((select auth.uid())))
)
);
create policy "Users can insert own completed" on public.completed_tasks
for insert with check ((select auth.uid()) = user_id);
-- Groups: anyone can view groups (to join via code)
create policy "Anyone can view groups" on public.groups
for select using (true);
create policy "Authenticated users can create groups" on public.groups
for insert with check ((select auth.uid()) = created_by);
-- Helper function to get group IDs for a user (bypasses RLS to avoid infinite recursion)
create or replace function public.get_user_group_ids(_user_id uuid)
returns setof uuid as $$
select group_id from public.group_members where user_id = _user_id;
$$ language sql security definer set search_path = '';
-- Group members: members can see their own memberships and memberships in groups they belong to
create policy "Members can view group membership" on public.group_members
for select using (
(select auth.uid()) = user_id
or group_id in (select public.get_user_group_ids((select auth.uid())))
);
create policy "Users can join groups" on public.group_members
for insert with check ((select auth.uid()) = user_id);
create policy "Users can leave or creators can remove" on public.group_members
for delete to authenticated using (
(select auth.uid()) = user_id
or group_id in (select id from public.groups where created_by = (select auth.uid()))
);
-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, email, display_name, avatar_url)
values (
new.id,
new.email,
coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
new.raw_user_meta_data->>'avatar_url'
);
return new;
end;
$$ language plpgsql security definer set search_path = '';
-- Trigger to auto-create profile
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
-- Function to generate invite codes
create or replace function generate_invite_code()
returns text as $$
begin
return upper(substr(md5(random()::text), 1, 6));
end;
$$ language plpgsql set search_path = '';
-- Function to check group membership (used by group_challenges RLS)
create or replace function public.is_group_member(_group_id uuid)
returns boolean as $$
select exists (
select 1 from public.group_members
where group_id = _group_id and user_id = auth.uid()
);
$$ language sql security definer set search_path = '';
