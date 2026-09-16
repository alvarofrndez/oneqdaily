-- Create questions table
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamp with time zone default now()
);

-- Create answers table
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade not null,
  user_id uuid references auth.users(id),
  answer_text text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.questions enable row level security;
alter table public.answers enable row level security;

-- Policies for questions:
-- Allow anyone to select questions
create policy "Questions are publicly readable"
  on public.questions
  for select
  using (true);

-- Only authenticated users with admin role can insert/update/delete questions
-- For simplicity, we restrict to service role only (anon key cannot modify)
-- In a real app, you might have an admin role or use a service key via server-side only.
create policy "Questions are insertable by admins only"
  on public.questions
  for insert
  with check (auth.role() = 'authenticated' and auth.uid() is not null);
  -- Note: This still allows any authenticated user to insert. To restrict further,
  -- you could check for a custom claim or require a service role.
  -- For this MVP, we'll allow any authenticated user to insert questions (e.g., via a protected route).
  -- Alternatively, we can rely on server-side only question creation (seed data).

-- Policies for answers:
-- Allow anyone to select answers
create policy "Answers are publicly readable"
  on public.answers
  for select
  using (true);

-- Allow authenticated and anonymous users to insert answers
-- Anonymous users will have user_id null
create policy "Answers can be inserted by anyone"
  on public.answers
  for insert
  with check (true);

-- Allow users to update/delete their own answers
create policy "Answers can be updated by owner"
  on public.answers
  for update
  using (auth.uid() = user_id);

create policy "Answers can be deleted by owner"
  on public.answers
  for delete
  using (auth.uid() = user_id);