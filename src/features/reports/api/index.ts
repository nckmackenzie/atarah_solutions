import { supabase } from '@/lib/supabase/supabase';
import type {
  ClientStatementParamValues,
  ExpenseParamValues,
  PaymentCollectionValues,
  ReportDates,
} from '@/features/reports/types/index.types';
import { dateFormat } from '@/lib/formatters';

export async function fetchOutstandingInvoices() {
  const { data, error } = await supabase.rpc('get_outstanding_invoices', {});
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchCollectedPayments(values: PaymentCollectionValues) {
  const { data, error } = await supabase.rpc('get_payment_report', {
    fdate: dateFormat(values.from),
    tdate: dateFormat(values.to),
    rtype: values.reportType,
    cid: values?.clientId,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchExpensesReport(values: ExpenseParamValues) {
  const { data, error } = await supabase.rpc('get_expenses_report', {
    fdate: dateFormat(values.from),
    tdate: dateFormat(values.to),
    rtype: values.reportType,
    pid: values?.projectId,
    accid: values?.accountId,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchClientStatement(values: ClientStatementParamValues) {
  const { data, error } = await supabase.rpc('get_client_statement', {
    client: values.clientId,
    from_date: dateFormat(values.from),
    to_date: dateFormat(values.to),
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchIncomeStatement(values: ReportDates) {
  const { data: expenses, error: expenseError } = await supabase.rpc(
    'get_expenses',
    {
      sdate: dateFormat(values.from),
      edate: dateFormat(values.to),
    }
  );

  if (expenseError) throw new Error(expenseError.message);

  const { data: incomes, error: incomeError } = await supabase.rpc(
    'get_revenues',
    {
      sdate: dateFormat(values.from),
      edate: dateFormat(values.to),
    }
  );

  if (incomeError) throw new Error(incomeError.message);

  return { incomes, expenses };
}
