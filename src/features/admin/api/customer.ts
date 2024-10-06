import type { CustomerFormValues } from '@/features/admin/types/customer.types';
// import { dateFormat } from '@/lib/formatters';
import { supabase } from '@/lib/supabase/supabase';

export async function fetchClients(query?: string) {
  let qry = supabase.from('clients').select('*');
  if (query) {
    qry = qry.or(`name.like.%${query}%,contact.like.%${query}%`);
  }

  const { data, error } = await qry.order('name', { ascending: true });

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

  // if (values?.openingBalance > 0) {
  //   const { data: header, error: insertError } = await supabase
  //     .from('invoice_headers')
  //     .insert({
  //       clientId: data[0].id,
  //       invoiceDate: dateFormat(values.openingBalanceDate!),
  //       dueDate: dateFormat(values.openingBalanceDate!),
  //       inclusiveAmount: values.openingBalance,
  //       exclusiveAmount: 0,
  //       vatAmount: 0,
  //       isOpeningBal: true,
  //     })
  //     .select('id')
  //     .single();

  //   if (!header) {
  //     await supabase.from('clients').delete().eq('id', data[0].id);
  //   }

  //   if (insertError) {
  //     throw new Error(insertError.message);
  //   }
  // }
}

export async function fetchClient(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateClient(id: string, values: CustomerFormValues) {
  const { error } = await supabase
    .from('clients')
    .update({
      active: values.active,
      address: values.address,
      contact: values.contact,
      email: values.email,
      name: values.name,
      taxPin: values.taxPin,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
