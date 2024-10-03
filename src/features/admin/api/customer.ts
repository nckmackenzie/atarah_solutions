import type { CustomerFormValues } from '@/features/admin/types/customer.types';
import { supabase } from '@/lib/supabase/supabase';

export async function fetchClients(query?: string) {
  let qry = supabase.from('clients').select('*');
  if (query) {
    qry = qry.or(`name.like.%${query}%,contact.like.%${query}%`);
  }

  const { data, error } = await qry;

  if (error) throw new Error(error.message);

  return data;
}

export async function createClient(values: CustomerFormValues) {
  const { error } = await supabase
    .from('clients')
    .insert([
      {
        ...values,
        openingBalanceDate: values.openingBalanceDate?.toISOString(),
      },
    ])
    .select();

  if (error) throw new Error(error.message);
}
