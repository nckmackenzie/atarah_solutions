import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, addMonths } from 'date-fns';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CustomSearchSelect from '@/components/ui/custom-select';
import { ErrorAlert } from '@/components/ui/custom-alert';
import FormFieldLoading from '@/components/ui/form-field-loading';
import DocumentNo from '@/components/ui/document-no';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InvoiceItems from './invoice-items';
import { Input } from '@/components/ui/input';
import Totals from '@/features/transactions/components/invoices/totals';

import { invoiceFormSchema } from '@/features/transactions/schema/invoice';
import { useClients } from '@/features/admin/hooks/clients/use-clients';
import { useDocumentNumbers } from '@/hooks/use-document-number';
import {
  createInvoice,
  fetchInvoice,
  fetchInvoiceNo,
  updateInvoice,
} from '@/features/transactions/api/invoice';
import { TERMS, VAT_TYPES } from '@/features/transactions/lib/constants';
import { dateFormat } from '@/lib/formatters';
import { useError } from '@/hooks/use-error';
import { useUser } from '@/features/auth/hooks/use-user';
import { useMutate } from '@/hooks/use-mutate';
import type { IsEditRequired } from '@/types/index.types';
import type {
  Invoice,
  InvoiceFormValues,
} from '@/features/transactions/types/invoice.types';
import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '@/components/ui/loaders';

interface InvoiceFormProps extends IsEditRequired {
  data?: Invoice;
}

export default function InvoiceForm({ isEdit, data }: InvoiceFormProps) {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const {
    data: invoice,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['invoice', 'clone', searchParams.get('cloneFrom')],
    queryFn: () => {
      if (!searchParams.get('cloneFrom')) return;
      return fetchInvoice(searchParams.get('cloneFrom') as string);
    },
    enabled: !!searchParams.get('cloneFrom'),
  });
  const form = useForm<InvoiceFormValues>({
    defaultValues: {
      clientId: '',
      items: [],
      vatType: 'no_vat',
      terms: 0,
      userId: user?.id || '',
    },
    resolver: zodResolver(invoiceFormSchema),
  });
  const { clients, errorClients, isLoadingClients } = useClients();
  const { docNumberError, documentNo, isFetchingNo } = useDocumentNumbers(
    'invoice no',
    fetchInvoiceNo
  );
  const { clearErrors, errors, onError } = useError();
  const { isPending, mutate } = useMutate(createInvoice, updateInvoice, {
    queryKey: 'invoices',
    redirectPath: '/transactions/invoices',
  });

  function calculateDueDate() {
    if (form.watch('invoiceDate') && form.watch('terms')) {
      form.setValue(
        'dueDate',
        addMonths(form.watch('invoiceDate'), Number(form.watch('terms')) || 0)
      );
    } else {
      form.setValue(
        'dueDate',
        addDays(form.watch('invoiceDate'), Number(form.watch('terms')) || 0)
      );
    }

    form.trigger('dueDate');
  }

  useEffect(
    function () {
      if (data) {
        form.reset({
          clientId: data.clientId,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          invoiceDate: new Date(data.invoiceDate),
          terms: data.terms ?? undefined,
          vatType: data.vatType,
          vat: data.vat,
          userId: user?.id,
          items: data.invoice_details.map(item => ({
            id: item.id.toString(),
            serviceId: item.serviceId,
            qty: item.qty,
            rate: item.rate,
          })),
        });
      }
    },
    [data, form, user]
  );

  useEffect(
    function () {
      if (invoice) {
        form.reset({
          clientId: invoice.clientId,
          terms: invoice.terms ?? undefined,
          vatType: invoice.vatType,
          vat: invoice.vat,
          userId: user?.id,
          items: invoice.invoice_details.map(item => ({
            id: item.id.toString(),
            serviceId: item.serviceId,
            qty: item.qty,
            rate: item.rate,
          })),
        });
      }
    },
    [invoice, form, user]
  );

  function onSubmit(values: InvoiceFormValues) {
    clearErrors();
    mutate(values, { onError: error => onError(error.message) });
  }

  if (isLoading) return <PageLoader loaderText="Fetching cloned data..." />;

  return (
    <div className="y-spacing">
      {(errorClients || docNumberError || errors || error) && (
        <ErrorAlert
          error={
            errors ||
            errorClients?.message ||
            docNumberError?.message ||
            error?.message ||
            'Error fetching'
          }
        />
      )}
      <Form {...form}>
        <form className="form-grid" onSubmit={form.handleSubmit(onSubmit)}>
          <DocumentNo
            documentNumber={data?.invoiceNo || documentNo || 1001}
            isLoading={isFetchingNo}
            label="Invoice No"
            className="col-span-full sm:col-span-4"
          />
          {isLoadingClients ? (
            <FormFieldLoading
              className="col-span-full sm:col-span-4"
              label="Customer"
            />
          ) : (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="col-span-full sm:col-span-4">
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      options={clients}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-4">
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <CustomSearchSelect
                    options={TERMS}
                    {...field}
                    value={field.value?.toString()}
                    disabled={isPending}
                    onChange={(value: string) => {
                      field.onChange(value);
                      if (form.watch('invoiceDate')) {
                        calculateDueDate();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-3">
                <FormLabel>Invoice Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isPending}
                    value={field.value ? dateFormat(field.value) : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                      calculateDueDate();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-3">
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    disabled={isPending}
                    {...field}
                    value={field.value ? dateFormat(field.value) : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatType"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-3">
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <CustomSearchSelect
                    options={VAT_TYPES}
                    {...field}
                    disabled={isPending}
                    onChange={(value: string) => {
                      field.onChange(value);
                      if (value === 'no_vat') {
                        form.setValue('vat', undefined);
                        form.trigger('vat');
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vat"
            render={({ field }) => (
              <FormItem className="col-span-full sm:col-span-3">
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <CustomSearchSelect
                    enableClear={false}
                    options={[{ label: 'VAT-16%', value: '16' }]}
                    {...field}
                    value={field.value?.toString()}
                    disabled={form.watch('vatType') === 'no_vat' || isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="col-span-full" />
          <InvoiceItems form={form} isPending={isPending} onError={onError} />
          <Separator className="col-span-full" />
          <Totals form={form} />
          <div className="col-span-full space-x-2">
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Update' : 'Create'}
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
