import { supabase } from '@/lib/supabase/supabase';
import type { GlAccountFormValues } from '@/features/admin/types/glaccount.types';

export async function fetchAccounts(query?: string) {
  let qry = supabase
    .from('gl_accounts')
    .select(
      'accountName,accountTypeId,active,id,parentId,accountNo,isSubCategory'
    );
  if (query) {
    qry = qry.like('accountName', `%${query}%`);
  }

  const { data, error } = await qry.order('accountName', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchGlAccounts(query?: string) {
  let qry = supabase
    .from('gl_accounts')
    .select(
      'accountName,accountTypeId,active,id,parentId,accountNo,isSubCategory'
    )
    .not('parentId', 'is', null);
  if (query) {
    qry = qry.like('accountName', `%${query}%`);
  }

  const { data, error } = await qry.order('accountName', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function createAccount(values: GlAccountFormValues) {
  const { error } = await supabase.from('gl_accounts').insert({
    accountName: values.name.toLowerCase(),
    accountTypeId: values.accountTypeId,
    isSubCategory: values.isSubcategory,
    parentId: values.isSubcategory ? values.parentId : values.accountTypeId,
    active: values.active,
  });

  if (error) throw new Error(error.message);
}

export async function fetchAccount(id: string) {
  const { data, error } = await supabase
    .from('gl_accounts')
    .select(
      'accountName,accountTypeId,active,id,parentId,accountNo,isSubCategory'
    )
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateAccount(id: string, values: GlAccountFormValues) {
  const { error } = await supabase
    .from('gl_accounts')
    .update({
      accountName: values.name.toLowerCase(),
      accountTypeId: values.accountTypeId,
      isSubCategory: values.isSubcategory,
      parentId: values.isSubcategory ? values.parentId : values.accountTypeId,
      active: values.active,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteAccount(id: string) {
  const { error } = await supabase.from('gl_accounts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
