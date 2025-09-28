-- Activer les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Table des profils utilisateurs
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  role text check (role in ('member','mentor','org','admin')) default 'member',
  location text,
  bio text,
  skills text[],
  github text,
  linkedin text,
  avatar_url text,
  points integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des défis
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  difficulty text check (difficulty in ('debutant','intermediaire','avance')) default 'debutant',
  category text not null,
  metric text not null, -- e.g. rmse, f1, map@k
  dataset_url text not null,
  rules text,
  prize_xof integer default 0,
  starts_at timestamptz default now(),
  ends_at timestamptz not null,
  status text check (status in ('a_venir','en_cours','termine')) default 'a_venir',
  org_id uuid references profiles(id),
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des soumissions
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  file_url text not null, -- storage URL (bucket supabase)
  score double precision,
  rank integer,
  status text check (status in ('pending','scored','error')) default 'pending',
  error_msg text,
  created_at timestamptz default now()
);

-- Table des projets
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  tech_stack text[],
  github_url text,
  demo_url text,
  status text check (status in ('planning','in_progress','completed','paused')) default 'planning',
  category text not null,
  founder_id uuid references profiles(id),
  image_url text,
  members integer default 1,
  stars integer default 0,
  forks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des membres de projets
create table public.project_members (
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'contributeur',
  joined_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- Table des mentors
create table public.mentors (
  user_id uuid primary key references profiles(id) on delete cascade,
  domains text[],
  availability text,
  description text,
  experience_years integer,
  created_at timestamptz default now()
);

-- Table des demandes de mentorat
create table public.mentor_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id),
  mentor_id uuid references mentors(user_id),
  goal text not null,
  level text check (level in ('debutant','intermediaire','avance')),
  domains text[],
  status text check (status in ('open','matched','completed','cancelled')) default 'open',
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des ressources
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  type text check (type in ('course','article','tool','dataset','video','book')) not null,
  category text not null,
  difficulty text check (difficulty in ('debutant','intermediaire','avance')) default 'debutant',
  author_id uuid references profiles(id),
  author_name text,
  url text not null,
  image_url text,
  rating double precision default 0,
  downloads integer default 0,
  duration text,
  tags text[],
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index pour les performances
create index submissions_challenge_score_idx on submissions (challenge_id, score desc);
create index submissions_user_created_idx on submissions (user_id, created_at desc);
create index projects_status_created_idx on projects (status, created_at desc);
create index resources_type_category_idx on resources (type, category);
create index mentor_requests_status_created_idx on mentor_requests (status, created_at desc);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table challenges enable row level security;
alter table submissions enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table mentors enable row level security;
alter table mentor_requests enable row level security;
alter table resources enable row level security;

-- Politiques RLS pour profiles
create policy "Profils visibles par tous" on profiles for select using (true);
create policy "Utilisateurs peuvent modifier leur profil" on profiles for update using (auth.uid() = id);
create policy "Utilisateurs peuvent créer leur profil" on profiles for insert with check (auth.uid() = id);

-- Politiques RLS pour challenges
create policy "Défis visibles par tous" on challenges for select using (true);
create policy "Seuls les admins/orgs peuvent créer des défis" on challenges 
  for insert with check (exists(select 1 from profiles where id = auth.uid() and role in ('admin', 'org')));
create policy "Créateurs peuvent modifier leurs défis" on challenges 
  for update using (org_id = auth.uid() or exists(select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Politiques RLS pour submissions
create policy "Utilisateurs voient leurs soumissions" on submissions for select using (user_id = auth.uid());
create policy "Utilisateurs peuvent créer des soumissions" on submissions for insert with check (user_id = auth.uid());
create policy "Admins voient toutes les soumissions" on submissions for select using (exists(select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Politiques RLS pour projects
create policy "Projets visibles par tous" on projects for select using (true);
create policy "Utilisateurs connectés peuvent créer des projets" on projects for insert with check (auth.uid() is not null);
create policy "Fondateurs peuvent modifier leurs projets" on projects for update using (founder_id = auth.uid());

-- Politiques RLS pour project_members
create policy "Membres de projets visibles par tous" on project_members for select using (true);
create policy "Fondateurs peuvent gérer les membres" on project_members 
  for all using (exists(select 1 from projects where id = project_id and founder_id = auth.uid()));

-- Politiques RLS pour mentors
create policy "Mentors visibles par tous" on mentors for select using (true);
create policy "Utilisateurs peuvent devenir mentors" on mentors for insert with check (user_id = auth.uid());
create policy "Mentors peuvent modifier leur profil" on mentors for update using (user_id = auth.uid());

-- Politiques RLS pour mentor_requests
create policy "Utilisateurs voient leurs demandes" on mentor_requests 
  for select using (requester_id = auth.uid() or mentor_id = auth.uid());
create policy "Utilisateurs peuvent créer des demandes" on mentor_requests 
  for insert with check (requester_id = auth.uid());
create policy "Participants peuvent modifier les demandes" on mentor_requests 
  for update using (requester_id = auth.uid() or mentor_id = auth.uid());

-- Politiques RLS pour resources
create policy "Ressources visibles par tous" on resources for select using (true);
create policy "Utilisateurs connectés peuvent créer des ressources" on resources 
  for insert with check (auth.uid() is not null);
create policy "Auteurs peuvent modifier leurs ressources" on resources 
  for update using (author_id = auth.uid() or exists(select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Triggers pour updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_challenges_updated_at before update on challenges
  for each row execute procedure update_updated_at_column();

create trigger update_projects_updated_at before update on projects
  for each row execute procedure update_updated_at_column();

create trigger update_mentor_requests_updated_at before update on mentor_requests
  for each row execute procedure update_updated_at_column();

create trigger update_resources_updated_at before update on resources
  for each row execute procedure update_updated_at_column();

-- Fonction pour mettre à jour le classement
create or replace function update_leaderboard(challenge_uuid uuid)
returns void as $$
begin
  update submissions s
  set rank = t.rnk
  from (
    select id, row_number() over (order by score asc) as rnk
    from submissions
    where challenge_id = challenge_uuid and status = 'scored'
  ) t
  where s.id = t.id and s.challenge_id = challenge_uuid;
end;
$$ language plpgsql security definer;

-- Fonction pour calculer le score RMSE (exemple)
create or replace function calculate_rmse_score(submission_uuid uuid, predictions jsonb, ground_truth jsonb)
returns double precision as $$
declare
  mse double precision := 0;
  count_rows integer := 0;
  pred_val double precision;
  true_val double precision;
  key text;
begin
  for key in select jsonb_object_keys(predictions)
  loop
    pred_val := (predictions->key)::double precision;
    true_val := (ground_truth->key)::double precision;
    mse := mse + power(pred_val - true_val, 2);
    count_rows := count_rows + 1;
  end loop;
  
  if count_rows = 0 then
    return null;
  end if;
  
  return sqrt(mse / count_rows);
end;
$$ language plpgsql security definer;
