import { supabase } from '@/lib/supabase/supabase';
import type { User } from '@/features/admin/types/user.types';

export async function fetchUsers(query?: string) {
  let qry = supabase.from('profiles').select('*');
  if (query) {
    qry = qry.or(`username.like.%${query}%,email.like.%${query}%`);
  }

  const { data, error } = await qry.order('username', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function changeUserStatus(status: User['active'], userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ active: status })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}
