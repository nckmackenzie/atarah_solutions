import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormFieldLoading from '@/components/ui/form-field-loading';
import CustomSearchSelect from '@/components/ui/custom-select';
import FormGroup from '@/components/ui/form-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorAlert } from '@/components/ui/custom-alert';
import PaymentInvoiceTable from '@/features/transactions/components/invoice-payments/payment-invoice-table';
import { Button } from '@/components/ui/button';

import { invoicePaymentFormSchema } from '@/features/transactions/schema/invoice';
import { useClients } from '@/features/admin/hooks/clients/use-clients';
import { dateFormat, numberFormat } from '@/lib/formatters';
import { PAYMENT_METHODS } from '@/features/transactions/lib/constants';
import { useError } from '@/hooks/use-error';
import {
  createPayment,
  fetchPendingInvoicesByClient,
  updateInvoicePayment,
} from '@/features/transactions/api/invoice';
import { useMutate } from '@/hooks/use-mutate';
import type { IsEditRequired } from '@/types/index.types';
import type {
  InvoicePayment,
  InvoicePaymentFormValues,
} from '@/features/transactions/types/invoice.types';
import { useEffect } from 'react';

interface InvoicePaymentFormProps extends IsEditRequired {
  data?: InvoicePayment;
}

export default function InvoicePaymentForm({
  isEdit,
  data,
}: InvoicePaymentFormProps) {
  const { clients, errorClients, isLoadingClients } = useClients();
  const { isPending, mutate } = useMutate(createPayment, updateInvoicePayment, {
    queryKey: 'invoice payments',
    redirectPath: '/transactions/invoices/payments',
  });
  const { clearErrors, onError, errors } = useError();
  const form = useForm<InvoicePaymentFormValues>({
    defaultValues: {
      clientId: '',
      paymentMethod: 'cheque',
      paymentReference: '',
      invoices: [],
    },
    resolver: zodResolver(invoicePaymentFormSchema),
  });

  useEffect(
    function () {
      if (data) {
        form.reset({
          clientId: data.clientId,
          paymentDate: new Date(data.paymentDate),
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference,
          invoices: data.invoice_payments.map(invoice => ({
            invoiceId: invoice.invoiceId as string,
            dueDate: invoice.invoice_headers?.dueDate
              ? new Date(invoice.invoice_headers.dueDate)
              : new Date(),
            invoiceNo: invoice.invoice_headers?.invoiceNo?.toString() || '',
            invoiceAmount:
              invoice.invoice_headers?.inclusiveAmount || undefined,
            balance: 0,
            amountPaid: invoice.amount,
          })),
        });
      }
    },
    [data, form]
  );

  function onSubmit(values: InvoicePaymentFormValues) {
    clearErrors();
    mutate(values, { onError: err => onError(err.message) });
  }

  function handleChange(value: string) {
    form.setValue('clientId', value);
    form.trigger('clientId');
    fetchPendingInvoicesByClient(value)
      .then(data => {
        const formatted = data.map(invoice => ({
          invoiceId: invoice.id,
          invoiceNo: invoice.invoiceno.toString(),
          invoiceAmount: invoice.invoiceamount,
          dueDate: new Date(invoice.duedate),
          balance: invoice.invoicebalance,
          amountPaid: 0,
        }));
        form.setValue('invoices', formatted);
        form.trigger('invoices');
      })
      .catch(err => onError(err.message));
  }

  const totalAmount = form
    .watch('invoices')
    .reduce((acc, cur) => acc + Number(cur.amountPaid), 0);

  return (
    <div className="y-spacing">
      {(errorClients || errors) && (
        <ErrorAlert error={errorClients?.message || errors || ''} />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
          {isLoadingClients ? (
            <FormFieldLoading
              label="Customer"
              className="col-span-full md:col-span-6"
            />
          ) : (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="col-span-full md:col-span-6">
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      options={clients}
                      {...field}
                      onChange={handleChange}
                      disabled={isPending}
                      enableClear={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="hidden md:block md:col-span-4 " />
          <FormGroup className="hidden md:block md:col-span-2">
            <Label>Amount Received</Label>
            <div className="input">{numberFormat(totalAmount)}</div>
          </FormGroup>
          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Payment Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isPending}
                    value={field.value ? dateFormat(field.value) : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <CustomSearchSelect
                    options={PAYMENT_METHODS}
                    {...field}
                    disabled={isPending}
                    enableClear={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentReference"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Payment Reference</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PaymentInvoiceTable
            form={form}
            isPending={isPending}
            isEdit={isEdit}
          />
          <div className="col-span-full space-x-2">
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button type="reset" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
