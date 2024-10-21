import { supabase } from '@/lib/supabase/supabase';
import {
  ClientStatementParamValues,
  ExpenseParamValues,
  PaymentCollectionValues,
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
    // pid: values?.projectId,
    pid: undefined,
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
