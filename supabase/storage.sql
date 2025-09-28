-- Configuration des buckets de stockage Supabase

-- Bucket pour les datasets (lecture publique)
insert into storage.buckets (id, name, public) values ('datasets', 'datasets', true);

-- Bucket pour les soumissions (lecture privée)
insert into storage.buckets (id, name, public) values ('submissions', 'submissions', false);

-- Bucket pour les avatars (lecture publique)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Bucket pour les images de projets (lecture publique)
insert into storage.buckets (id, name, public) values ('projects', 'projects', true);

-- Bucket pour les images de ressources (lecture publique)
insert into storage.buckets (id, name, public) values ('resources', 'resources', true);

-- Politiques pour le bucket datasets
-- Lecture publique pour tous
create policy "Datasets sont visibles par tous" on storage.objects
  for select using (bucket_id = 'datasets');

-- Écriture pour les admins et orgs seulement
create policy "Seuls les admins/orgs peuvent uploader des datasets" on storage.objects
  for insert with check (
    bucket_id = 'datasets' 
    and exists(
      select 1 from profiles 
      where id = auth.uid() 
      and role in ('admin', 'org')
    )
  );

-- Politiques pour le bucket submissions
-- Lecture : seul le propriétaire et les admins
create policy "Utilisateurs peuvent lire leurs soumissions" on storage.objects
  for select using (
    bucket_id = 'submissions' 
    and (
      auth.uid()::text = (storage.foldername(name))[2]
      or exists(
        select 1 from profiles 
        where id = auth.uid() 
        and role = 'admin'
      )
    )
  );

-- Écriture : utilisateurs connectés pour leurs propres soumissions
create policy "Utilisateurs peuvent uploader leurs soumissions" on storage.objects
  for insert with check (
    bucket_id = 'submissions' 
    and auth.uid()::text = (storage.foldername(name))[2]
  );

-- Politiques pour le bucket avatars
-- Lecture publique
create policy "Avatars sont visibles par tous" on storage.objects
  for select using (bucket_id = 'avatars');

-- Écriture : utilisateurs pour leur propre avatar
create policy "Utilisateurs peuvent uploader leur avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Utilisateurs peuvent modifier leur avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Politiques pour le bucket projects
-- Lecture publique
create policy "Images de projets sont visibles par tous" on storage.objects
  for select using (bucket_id = 'projects');

-- Écriture : utilisateurs connectés
create policy "Utilisateurs connectés peuvent uploader des images de projets" on storage.objects
  for insert with check (
    bucket_id = 'projects' 
    and auth.uid() is not null
  );

-- Politiques pour le bucket resources
-- Lecture publique
create policy "Images de ressources sont visibles par tous" on storage.objects
  for select using (bucket_id = 'resources');

-- Écriture : utilisateurs connectés
create policy "Utilisateurs connectés peuvent uploader des images de ressources" on storage.objects
  for insert with check (
    bucket_id = 'resources' 
    and auth.uid() is not null
  );

-- Fonction helper pour extraire les dossiers du chemin
create or replace function storage.foldername(name text)
returns text[] language sql as $$
  select string_to_array(name, '/')
$$;
