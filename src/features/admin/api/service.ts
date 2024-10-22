import { supabase } from '@/lib/supabase/supabase';
import type { ServiceFormValues } from '@/features/admin/types/service';

export async function fetchServices(query?: string) {
  let qry = supabase.from('services').select('*');
  if (query) {
    qry = qry.or(`serviceName.like.%${query}%,description.like.%${query}%`);
  }

  const { data, error } = await qry.order('serviceName', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}
export async function createService(values: ServiceFormValues) {
  const { error } = await supabase
    .from('services')
    .insert({ ...values, accountId: +values.accountId });

  if (error) throw new Error(error.message);
}

export async function fetchService(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateService(id: string, values: ServiceFormValues) {
  const { error } = await supabase
    .from('services')
    .update({ ...values, accountId: +values.accountId })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
