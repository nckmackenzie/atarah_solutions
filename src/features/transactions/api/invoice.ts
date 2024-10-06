import { supabase } from '@/lib/supabase/supabase';
import type { InvoiceFormValues } from '@/features/transactions/types/invoice.types';
import { calculateVatValues } from '@/features/transactions/lib/utils';
import { dateFormat } from '@/lib/formatters';

export async function fetchInvoiceNo() {
  const { data, error } = await supabase
    .from('invoice_headers')
    .select('invoiceNo')
    .order('invoiceNo', { ascending: false })
    .eq('isOpeningBal', false)
    .limit(1);
  if (error) throw new Error(error.message);

  return data.length ? data[0].invoiceNo! + 1 : 1001;
}

export async function fetchServiceRate(value: string) {
  const { data, error } = await supabase
    .from('services')
    .select('serviceRate')
    .eq('id', value)
    .single();

  if (error) throw new Error(error.message);

  return data.serviceRate || 0;
}

export async function createInvoice(values: InvoiceFormValues) {
  const invoiceNo = await fetchInvoiceNo();
  const total = values.items.reduce(
    (acc, item) => acc + Number(item.rate) * Number(item.qty),
    0
  );
  const amounts = calculateVatValues(values.vatType, total, values.vat || 0);
  const { data, error } = await supabase
    .from('invoice_headers')
    .insert({
      clientId: values.clientId,
      invoiceDate: dateFormat(values.invoiceDate),
      invoiceNo,
      dueDate: dateFormat(values.dueDate),
      terms: values.terms,
      vatType: values.vatType,
      vat: values.vat,
      exclusiveAmount: amounts.exclusive,
      vatAmount: amounts.vatValue,
      inclusiveAmount: amounts.inclusive,
      createdBy: values.userId,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  if (data) {
    const formattedDetails = values.items.map(item => ({
      headerId: data.id,
      serviceId: item.serviceId,
      qty: item.qty,
      rate: item.rate,
    }));
    const { error: detailsError, data: detailsData } = await supabase
      .from('invoice_details')
      .insert(formattedDetails)
      .select('id');

    if (detailsError) throw new Error(detailsError.message);

    if (!detailsData) {
      await supabase.from('invoice_headers').delete().eq('id', data.id);
      throw new Error('Failed to create invoice');
    }
  }
}

export async function fetchInvoices(query?: string) {
  const { data, error } = await supabase.rpc('get_invoices', {
    param: query || '',
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchInvoice(id: string) {
  const { data, error } = await supabase
    .from('invoice_headers')
    .select('*,invoice_details(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);

  return data;
}

export async function updateInvoice(id: string, values: InvoiceFormValues) {
  const total = values.items.reduce(
    (acc, item) => acc + Number(item.rate) * Number(item.qty),
    0
  );
  const amounts = calculateVatValues(values.vatType, total, values.vat || 0);
  const { data, error } = await supabase
    .from('invoice_headers')
    .update({
      clientId: values.clientId,
      invoiceDate: dateFormat(values.invoiceDate),
      dueDate: dateFormat(values.dueDate),
      terms: values.terms,
      vatType: values.vatType,
      vat: values.vat,
      exclusiveAmount: amounts.exclusive,
      vatAmount: amounts.vatValue,
      inclusiveAmount: amounts.inclusive,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (data) {
    await supabase.from('invoice_details').delete().eq('headerId', id);

    const formattedDetails = values.items.map(item => ({
      headerId: data.id,
      serviceId: item.serviceId,
      qty: item.qty,
      rate: item.rate,
    }));
    const { error: detailsError, data: detailsData } = await supabase
      .from('invoice_details')
      .insert(formattedDetails)
      .select('id');

    if (detailsError) throw new Error(detailsError.message);

    if (!detailsData) {
      throw new Error('Failed to create invoice');
    }
  }
}

export async function deleteInvoice(id: string) {
  await supabase.from('invoice_details').delete().eq('headerId', id);

  const { error } = await supabase
    .from('invoice_headers')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
