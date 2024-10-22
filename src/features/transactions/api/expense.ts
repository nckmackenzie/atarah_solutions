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
  const totalAmount = values.details.reduce(
    (acc, cur) => acc + Number(cur.amount),
    0
  );

  const { error, data } = await supabase
    .from('expenses_headers')
    .insert({
      expenseDate: dateFormat(values.expenseDate),
      expenseNo,
      payee: values.payee.toLowerCase(),
      paymentMethod: values.paymentMethod,
      projectId: values.projectId,
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

  values.details.forEach(async item => {
    const { data: accountDetails } = await supabase
      .rpc('get_account_details', {
        accid: item.accountId,
      })
      .single();

    if (!accountDetails) throw new Error('Account not found');

    await supabase.from('ledger').insert({
      account: accountDetails?.accountname.toLowerCase(),
      transactionDate: dateFormat(values.expenseDate),
      transactionType: 'expense',
      transactionId: data.id,
      accountTypeId: accountDetails.accounttypeid,
      parentAccount: accountDetails.parent,
      debit: item.amount,
      narration: item.narration,
    });
  });

  await supabase.from('ledger').insert({
    account: 'cash and cash equivalents',
    transactionDate: dateFormat(values.expenseDate),
    transactionType: 'expense',
    transactionId: data.id,
    accountTypeId: 3,
    parentAccount: 'cash and cash equivalents',
    credit: totalAmount,
  });
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
    projectId: data.projectId ?? undefined,
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
  const totalAmount = values.details.reduce(
    (acc, cur) => acc + Number(cur.amount),
    0
  );
  const { error } = await supabase
    .from('expenses_headers')
    .update({
      expenseDate: dateFormat(values.expenseDate),
      payee: values.payee.toLowerCase(),
      paymentMethod: values.paymentMethod,
      paymentReference: values?.paymentReference?.toLowerCase(),
      projectId: values.projectId,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);

  await supabase.from('expenses_details').delete().eq('headerId', id);
  await supabase
    .from('ledger')
    .delete()
    .eq('transactionId', id)
    .eq('transactionType', 'expense');

  const formattedExpense = values.details.map(detail => ({
    headerId: id,
    amount: detail.amount,
    accountId: detail.accountId,
    narration: detail?.narration?.toLowerCase(),
  }));
  await supabase.from('expenses_details').insert(formattedExpense);

  values.details.forEach(async item => {
    const { data: accountDetails } = await supabase
      .rpc('get_account_details', {
        accid: item.accountId,
      })
      .single();

    if (!accountDetails) throw new Error('Account not found');

    await supabase.from('ledger').insert({
      account: accountDetails?.accountname.toLowerCase(),
      transactionDate: dateFormat(values.expenseDate),
      transactionType: 'expense',
      transactionId: id,
      accountTypeId: accountDetails.accounttypeid,
      parentAccount: accountDetails.parent,
      debit: item.amount,
      narration: item.narration,
    });
  });

  await supabase.from('ledger').insert({
    account: 'cash and cash equivalents',
    transactionDate: dateFormat(values.expenseDate),
    transactionType: 'expense',
    transactionId: id,
    accountTypeId: 3,
    parentAccount: 'cash and cash equivalents',
    credit: totalAmount,
  });
}

export async function deleteExpense(id: string) {
  await supabase.from('expenses_details').delete().eq('headerId', id);
  await supabase
    .from('ledger')
    .delete()
    .eq('transactionId', id)
    .eq('transactionType', 'expense');

  const { error } = await supabase
    .from('expenses_headers')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
