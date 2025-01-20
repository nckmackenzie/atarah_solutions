import { useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import CustomSearchSelect from '@/components/ui/custom-select';
import { Separator } from '@/components/ui/separator';
import ExpenseDetails from '@/features/transactions/components/expenses/expense-details';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import DocumentNo from '@/components/ui/document-no';
import FormFieldLoading from '@/components/ui/form-field-loading';

import { expenseFormSchema } from '@/features/transactions/schema/expense';
import { PAYMENT_METHODS } from '@/features/transactions/lib/constants';
import { dateFormat } from '@/lib/formatters';
import { useFormReset } from '@/hooks/use-form-reset';
import { useError } from '@/hooks/use-error';
import { useDocumentNumbers } from '@/hooks/use-document-number';
import {
  createExpense,
  fetchExpenseNo,
  updateExpense,
} from '@/features/transactions/api/expense';
import { useMutate } from '@/hooks/use-mutate';
import { useProjects } from '@/features/admin/hooks/projects/use-projects';
import type { IsEditRequired } from '@/types/index.types';
import type {
  Expense,
  ExpenseFormValues,
} from '@/features/transactions/types/expense.types';

interface ExpenseFormProps extends IsEditRequired {
  data?: Expense;
}

export default function ExpenseForm({ isEdit, data }: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    defaultValues: {
      details: [],
      payee: '',
      paymentMethod: 'mpesa',
      paymentReference: '',
      projectId: undefined,
    },
    resolver: zodResolver(expenseFormSchema),
  });

  const reset = useFormReset<ExpenseFormValues>();
  const { clearErrors, errors, onError } = useError();
  const { isLoadingProjects, projects, projectsError } = useProjects();
  const { docNumberError, documentNo, isFetchingNo } = useDocumentNumbers(
    'expense no',
    fetchExpenseNo
  );
  const { isPending, mutate } = useMutate(createExpense, updateExpense, {
    queryKey: 'expenses',
    redirectPath: '/transactions/expenses',
  });

  useEffect(
    function () {
      if (data) {
        form.reset({
          expenseDate: data.expenseDate,
          payee: data.payee,
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference,
          projectId: data.projectId,
          details: data.details.map(detail => ({
            accountId: detail.accountId,
            amount: detail.amount,
            narration: detail.narration,
            id: detail.id,
          })),
        });
      }
    },
    [form, data]
  );

  function onSubmit(values: ExpenseFormValues) {
    clearErrors();
    if (values.details.length === 0) {
      onError('Please add expense details');
      return;
    }
    mutate(
      {
        ...values,
        projectId: values.projectId === '' ? undefined : values.projectId,
      },
      { onError: error => onError(error.message) }
    );
  }

  return (
    <div className="y-spacing">
      {(errors || docNumberError || projectsError) && (
        <ErrorAlert
          error={
            errors ||
            docNumberError?.message ||
            projectsError?.message ||
            'Something went wrong'
          }
        />
      )}
      <DocumentNo
        isLoading={isFetchingNo}
        documentNumber={data?.expenseNo || documentNo || ''}
        label="Expense No"
        className="w-full md:w-96"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem className="col-span-full md:col-span-3">
                <FormLabel>Expense Date</FormLabel>
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
            name="payee"
            render={({ field }) => (
              <FormItem className="col-span-full md:col-span-3">
                <FormLabel>Payee</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Enter payee"
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
              <FormItem className="col-span-full md:col-span-3">
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <CustomSearchSelect
                    enableClear={false}
                    {...field}
                    disabled={isPending}
                    options={PAYMENT_METHODS}
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
              <FormItem className="col-span-full md:col-span-3">
                <FormLabel>Payment Reference</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Enter payment reference"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingProjects ? (
            <FormFieldLoading label="Project" className="form-col" />
          ) : (
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="form-col">
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      enableClear={false}
                      options={projects}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Separator className="col-span-full" />
          <ExpenseDetails form={form} isPending={isPending} />
          <div className="col-span-full space-x-2">
            <Button disabled={isPending} type="submit">
              {isEdit ? 'Update' : 'Submit'}
            </Button>
            <Button
              disabled={isPending}
              type="reset"
              variant="outline"
              onClick={() => reset(form)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
