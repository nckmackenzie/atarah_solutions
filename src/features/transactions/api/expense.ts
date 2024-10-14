import { ExpenseFormValues } from '@/features/transactions/types/expense.types';
import { dateFormat } from '@/lib/formatters';
import { supabase } from '@/lib/supabase/supabase';

export async function fetchExpenseNo() {
  const { error, data } = await supabase
    .from('expenses_headers')
    .select('expenseNo')
    .order('expenseNo', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data.length > 0 ? data[0].expenseNo + 1 : 1;
}

export async function fetchExpenses(query?: string) {
  let qry = supabase.from('vw_expenses').select('*');
  if (query) {
    qry = qry.or(`payee.like.%${query}%,paymentReference.like.%${query}%`);
  }

  const { data, error } = await qry.order('expenseDate', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createExpense(values: ExpenseFormValues) {
  const expenseNo = await fetchExpenseNo();

  const { error, data } = await supabase
    .from('expenses_headers')
    .insert({
      expenseDate: dateFormat(values.expenseDate),
      expenseNo,
      payee: values.payee.toLowerCase(),
      paymentMethod: values.paymentMethod,
      paymentReference: values?.paymentReference?.toLowerCase(),
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  const formattedExpense = values.details.map(detail => ({
    headerId: data.id,
    amount: detail.amount,
    accountId: detail.accountId,
    narration: detail?.narration?.toLowerCase(),
  }));
  const { data: details } = await supabase
    .from('expenses_details')
    .insert(formattedExpense)
    .select('id');

  if (!details?.length) {
    await supabase.from('expenses_headers').delete().eq('id', data.id);
    throw new Error('Failed to create expense');
  }
}

export async function fetchExpense(id: string) {
  const { data, error } = await supabase
    .from('expenses_headers')
    .select('*,expenses_details(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    expenseDate: new Date(data.expenseDate),
    expenseNo: data.expenseNo,
    payee: data.payee,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference ?? undefined,
    details: data.expenses_details.map(dt => ({
      ...dt,
      id: dt.id.toString(),
      narration: dt.narration ?? undefined,
    })),
  };
}

export async function updateExpense(id: string, values: ExpenseFormValues) {
  const { error } = await supabase
    .from('expenses_headers')
    .update({
      expenseDate: dateFormat(values.expenseDate),
      payee: values.payee.toLowerCase(),
      paymentMethod: values.paymentMethod,
      paymentReference: values?.paymentReference?.toLowerCase(),
    })
    .eq('id', id);
  if (error) throw new Error(error.message);

  await supabase.from('expenses_details').delete().eq('headerId', id);

  const formattedExpense = values.details.map(detail => ({
    headerId: id,
    amount: detail.amount,
    accountId: detail.accountId,
    narration: detail?.narration?.toLowerCase(),
  }));
  await supabase.from('expenses_details').insert(formattedExpense);
}

export async function deleteExpense(id: string) {
  await supabase.from('expenses_details').delete().eq('headerId', id);

  const { error } = await supabase
    .from('expenses_headers')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
