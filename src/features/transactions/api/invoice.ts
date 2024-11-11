import { supabase } from '@/lib/supabase/supabase';
import type {
  InvoiceFormValues,
  InvoicePaymentFormValues,
  PaymentType,
} from '@/features/transactions/types/invoice.types';
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

export async function fetchServiceDetails(value: string) {
  const { data, error } = await supabase
    .from('services')
    .select('serviceRate,accountId')
    .eq('id', value)
    .single();

  if (error) throw new Error(error.message);

  return data;
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

    values.items.forEach(async item => {
      const totalAmount = item.qty * item.rate;
      const vatAmounts = calculateVatValues(
        values.vatType,
        totalAmount,
        values.vat || 16
      );
      const { data: accountDetails } = await supabase
        .rpc('get_account_details', {
          accid: item.accountId,
        })
        .single();

      if (!accountDetails) throw new Error('Account not found');

      await supabase.from('ledger').insert({
        account: accountDetails?.accountname.toLowerCase(),
        transactionDate: dateFormat(values.invoiceDate),
        transactionType: 'invoice',
        transactionId: data.id,
        accountTypeId: accountDetails.accounttypeid,
        parentAccount: accountDetails.parent,
        credit: vatAmounts.inclusive,
      });
    });

    await supabase.from('ledger').insert({
      account: 'accounts receivable',
      transactionDate: dateFormat(values.invoiceDate),
      transactionType: 'invoice',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'accounts receivable',
      debit: amounts.inclusive,
    });
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

export async function fetchInvoiceWithDetails(id: string) {
  const { data, error } = await supabase
    .from('invoice_headers')
    .select('*,invoice_details(*,services(serviceName)),clients(name)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);

  const formattedData = {
    id: data.id,
    invoiceNo: data.invoiceNo?.toString() as string,
    invoiceDate: data.invoiceDate,
    dueDate: data.dueDate,
    client: data.clients?.name as string,
    vat: data.vat,
    exclusiveAmount: data.exclusiveAmount,
    vatAmount: data.vatAmount,
    inclusiveAmount: data.inclusiveAmount,
    details: data.invoice_details.map(detail => ({
      serviceName: detail.services?.serviceName as string,
      qty: detail.qty,
      rate: detail.rate,
      amount: detail.qty * detail.rate,
    })),
  };

  return formattedData;
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
    await supabase
      .from('ledger')
      .delete()
      .eq('transactionId', id)
      .eq('transactionType', 'invoice');

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

    values.items.forEach(async item => {
      const totalAmount = item.qty * item.rate;
      const vatAmounts = calculateVatValues(
        values.vatType,
        totalAmount,
        values.vat || 16
      );
      const { data: accountDetails } = await supabase
        .rpc('get_account_details', {
          accid: item.accountId,
        })
        .single();

      if (!accountDetails) throw new Error('Account not found');

      await supabase.from('ledger').insert({
        account: accountDetails?.accountname.toLowerCase(),
        transactionDate: dateFormat(values.invoiceDate),
        transactionType: 'invoice',
        transactionId: data.id,
        accountTypeId: accountDetails.accounttypeid,
        parentAccount: accountDetails.parent,
        credit: vatAmounts.inclusive,
      });
    });

    await supabase.from('ledger').insert({
      account: 'accounts receivable',
      transactionDate: dateFormat(values.invoiceDate),
      transactionType: 'invoice',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'accounts receivable',
      debit: amounts.inclusive,
    });
  }
}

export async function deleteInvoice(id: string) {
  await supabase.from('invoice_details').delete().eq('headerId', id);
  await supabase
    .from('ledger')
    .delete()
    .eq('transactionId', id)
    .eq('transactionType', 'invoice');

  const { error } = await supabase
    .from('invoice_headers')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchPendingInvoicesByClient(clientId: string) {
  const { data, error } = await supabase.rpc(
    'get_invoice_with_balance_by_client',
    { client: clientId }
  );

  if (error) throw new Error(error.message);

  return data;
}

export async function createPayment(values: InvoicePaymentFormValues) {
  const totalAmount = values.invoices.reduce(
    (acc, cur) => acc + Number(cur.amountPaid),
    0
  );
  const { error, data } = await supabase
    .from('invoice_payment_header')
    .insert({
      clientId: values.clientId,
      paymentDate: dateFormat(values.paymentDate),
      paymentMethod: values.paymentMethod,
      paymentReference: values.paymentReference,
      totalAmount,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);

  if (data) {
    const formatted = values.invoices
      .filter(inv => inv.amountPaid > 0)
      .map(inv => ({
        transactionDate: dateFormat(values.paymentDate),
        invoiceId: inv.invoiceId,
        transacfionType: 'debit' as PaymentType,
        amount: inv.amountPaid,
        paymentMethod: values.paymentMethod,
        paymentReference: values.paymentReference,
        paymentId: data.id,
      }));
    const { data: paymentHeaderData } = await supabase
      .from('invoice_payments')
      .insert(formatted)
      .select('id');

    if (!paymentHeaderData) {
      await supabase.from('invoice_payment_header').delete().eq('id', data.id);
      throw new Error('Failed to create payment');
    }

    await supabase.from('ledger').insert({
      account: 'accounts receivable',
      transactionDate: dateFormat(values.paymentDate),
      transactionType: 'invoice_payment',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'accounts receivable',
      credit: totalAmount,
    });

    await supabase.from('ledger').insert({
      account: 'cash and cash equivalents',
      transactionDate: dateFormat(values.paymentDate),
      transactionType: 'invoice_payment',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'cash and cash equivalents',
      debit: totalAmount,
    });
  }
}

export async function fetchInvoicePayments(query?: string) {
  let qry = supabase.from('invoice_payment_header').select('*,clients(name)');

  if (query) {
    qry = qry.like('clients.name', query);
  }
  const { data, error } = await qry.order('paymentDate', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function fetchInvoicePayment(id: string) {
  const { data, error } = await supabase
    .from('invoice_payment_header')
    .select(
      '*,invoice_payments(*,invoice_headers(invoiceNo,dueDate,inclusiveAmount))'
    )
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateInvoicePayment(
  id: string,
  values: InvoicePaymentFormValues
) {
  const totalAmount = values.invoices.reduce(
    (acc, cur) => acc + Number(cur.amountPaid),
    0
  );
  const { data, error } = await supabase
    .from('invoice_payment_header')
    .update({
      paymentDate: dateFormat(values.paymentDate),
      paymentMethod: values.paymentMethod,
      paymentReference: values.paymentReference,
      totalAmount,
    })
    .eq('id', id)
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  if (data) {
    await supabase.from('invoice_payments').delete().eq('paymentId', id);
    await supabase
      .from('ledger')
      .delete()
      .eq('transactionId', id)
      .eq('transactionType', 'invoice_payment');

    const formatted = values.invoices
      .filter(inv => inv.amountPaid > 0)
      .map(inv => ({
        transactionDate: dateFormat(values.paymentDate),
        invoiceId: inv.invoiceId,
        transacfionType: 'debit' as PaymentType,
        amount: inv.amountPaid,
        paymentMethod: values.paymentMethod,
        paymentReference: values.paymentReference,
        paymentId: data.id,
      }));
    const { data: paymentHeaderData } = await supabase
      .from('invoice_payments')
      .insert(formatted)
      .select('id');

    if (!paymentHeaderData) {
      throw new Error('Failed to create payment');
    }

    await supabase.from('ledger').insert({
      account: 'accounts receivable',
      transactionDate: dateFormat(values.paymentDate),
      transactionType: 'invoice_payment',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'accounts receivable',
      credit: totalAmount,
    });

    await supabase.from('ledger').insert({
      account: 'cash and cash equivalents',
      transactionDate: dateFormat(values.paymentDate),
      transactionType: 'invoice_payment',
      transactionId: data.id,
      accountTypeId: 3,
      parentAccount: 'cash and cash equivalents',
      debit: totalAmount,
    });
  }
}

export async function deletePayment(id: string) {
  await supabase.from('invoice_payments').delete().eq('paymentId', id);
  await supabase.from('invoice_payment_header').delete().eq('id', id);
  await supabase
    .from('ledger')
    .delete()
    .eq('transactionId', id)
    .eq('transactionType', 'invoice_payment');
}
