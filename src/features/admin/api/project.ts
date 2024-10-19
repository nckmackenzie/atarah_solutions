import { supabase } from '@/lib/supabase/supabase';
import type { ProjectFormValues } from '@/features/admin/types/project.types';

export async function fetchProjects(query?: string) {
  let qry = supabase.from('projects').select('*');
  if (query) {
    qry = qry.or(`projectName.like.%${query}%,description.like.%${query}%`);
  }

  const { data, error } = await qry.order('projectName', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function createProject(values: ProjectFormValues) {
  const { error } = await supabase.from('projects').insert(values);

  if (error) throw new Error(error.message);
}

export async function fetchProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(id: string, values: ProjectFormValues) {
  const { error } = await supabase
    .from('projects')
    .update({ ...values })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
