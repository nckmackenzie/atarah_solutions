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
import FormFieldLoading from '@/components/ui/form-field-loading';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import CustomSearchSelect from '@/components/ui/custom-select';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { glAccountSchema } from '@/features/admin/schemas/glaccounts';
import { useAccounts } from '@/features/admin/hooks/accounts/use-accounts';
import { useFormReset } from '@/hooks/use-form-reset';
import { useMutate } from '@/hooks/use-mutate';
import { createAccount, updateAccount } from '@/features/admin/api/glaccounts';
import { useError } from '@/hooks/use-error';
import type { IsEditRequired } from '@/types/index.types';
import type {
  GlAccountFormValues,
  GlAccount,
} from '@/features/admin/types/glaccount.types';

interface GlAccountsFormProps extends IsEditRequired {
  data?: GlAccount;
}

export default function GlAccountsForm({ isEdit, data }: GlAccountsFormProps) {
  const { accountTypes, accountsError, isLoadingAccounts, accounts } =
    useAccounts();
  const reset = useFormReset<GlAccountFormValues>();
  const { clearErrors, errors, onError } = useError();
  const { isPending, mutate } = useMutate(createAccount, updateAccount, {
    queryKey: 'gl accounts',
    redirectPath: '/admin/glaccounts',
  });
  const form = useForm<GlAccountFormValues>({
    defaultValues: {
      name: '',
      isSubcategory: false,
      active: true,
    },
    resolver: zodResolver(glAccountSchema),
  });

  useEffect(
    function () {
      if (data) {
        form.reset({
          name: data.accountName.toUpperCase(),
          accountTypeId: data.accountTypeId ?? undefined,
          active: data.active,
          isSubcategory: data.isSubCategory,
          parentId: data.parentId || undefined,
        });
      }
    },
    [data, form]
  );

  const parentAccounts = accounts?.filter(
    acc => acc.parentId === Number(form.watch('accountTypeId'))
  );

  function onSubmit(values: GlAccountFormValues) {
    clearErrors();
    mutate(values, { onError: error => onError(error.message) });
  }

  return (
    <div className="space-y-4">
      {(accountsError || errors) && (
        <ErrorAlert
          error={accountsError?.message || errors || 'Problem peforming action'}
        />
      )}
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="eg Petty cash, utility bills"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingAccounts ? (
            <FormFieldLoading className="w-full" label="Account Type" />
          ) : (
            <FormField
              control={form.control}
              name="accountTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      options={accountTypes}
                      value={field.value?.toString()}
                      enableClear={false}
                      onChange={(value: string) => {
                        field.onChange(value);
                        form.setValue('parentId', undefined);
                        form.trigger('parentId');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="isSubcategory"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSubCategory"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="isSubCategory"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Is Subcategory of
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {isLoadingAccounts ? (
            <FormFieldLoading className="w-full" label="Account Type" />
          ) : (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomSearchSelect
                      options={parentAccounts}
                      value={field.value?.toString()}
                      onChange={field.onChange}
                      disabled={!form.watch('isSubcategory')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {isEdit && (
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="airplane-mode">
                      {form.watch('active') ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </FormItem>
              )}
            />
          )}
          <div className="space-x-2 col-span-full">
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Edit' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
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
