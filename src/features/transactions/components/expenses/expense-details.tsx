import { useFieldArray, type UseFormReturn } from 'react-hook-form';

import type { IsPending } from '@/types/index.types';
import type { ExpenseFormValues } from '@/features/transactions/types/expense.types';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAccounts } from '@/features/admin/hooks/accounts/use-accounts';
import FormFieldLoading from '@/components/ui/form-field-loading';
import CustomSearchSelect from '@/components/ui/custom-select';
import { Trash } from 'lucide-react';

interface ExpenseDetailsProps extends IsPending {
  form: UseFormReturn<ExpenseFormValues>;
}

export default function ExpenseDetails({
  form,
  isPending,
}: ExpenseDetailsProps) {
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'details',
  });
  const { expenseAccounts, isLoadingAccounts } = useAccounts();

  return (
    <div className="col-span-full space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: new Date().getTime().toString(),
            accountId: '',
            amount: 0,
            narration: '',
          })
        }
      >
        Add Expense
      </Button>
      {fields.map((field, index) => (
        <div key={field.id} className="form-grid">
          {isLoadingAccounts ? (
            <FormFieldLoading label="Expense Account" className="form-col" />
          ) : (
            <FormField
              control={form.control}
              name={`details.${index}.accountId`}
              render={({ field }) => (
                <FormItem className="form-col">
                  <FormLabel>Expense Account</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      enableClear={false}
                      {...field}
                      options={expenseAccounts}
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
            name={`details.${index}.amount`}
            render={({ field }) => (
              <FormItem className="col-span-full md:col-span-2">
                <FormLabel>Expense Amount</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Enter expense amount"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`details.${index}.narration`}
            render={({ field }) => (
              <FormItem className="col-span-full md:col-span-3">
                <FormLabel>Narration</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Enter expense description...optional"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="self-end"
          >
            <Trash className="icon text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
