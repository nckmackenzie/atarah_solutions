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
import { ErrorAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { serviceFormSchema } from '@/features/admin/schemas/service';
import { useFormReset } from '@/hooks/use-form-reset';
import { useMutate } from '@/hooks/use-mutate';
import { createService, updateService } from '@/features/admin/api/service';
import { useError } from '@/hooks/use-error';
import { useAccounts } from '@/features/admin/hooks/accounts/use-accounts';
import type { IsEditRequired } from '@/types/index.types';
import type {
  ServiceFormValues,
  Service,
} from '@/features/admin/types/service';
import CustomSearchSelect from '@/components/ui/custom-select';
import FormFieldLoading from '@/components/ui/form-field-loading';

interface ServiceFormProps extends IsEditRequired {
  data?: Service;
}
export default function ServiceForm({ isEdit, data }: ServiceFormProps) {
  const { accounts, isLoadingAccounts, accountsError } = useAccounts();
  const form = useForm<ServiceFormValues>({
    defaultValues: {
      description: '',
      serviceName: '',
      serviceRate: 0,
    },
    resolver: zodResolver(serviceFormSchema),
  });
  const reset = useFormReset<ServiceFormValues>();
  const { isPending, mutate } = useMutate(createService, updateService, {
    queryKey: 'services',
    redirectPath: '/admin/services',
  });
  const { clearErrors, errors, onError } = useError();

  function onSubmit(values: ServiceFormValues) {
    clearErrors();
    mutate(values, { onError: error => onError(error.message) });
  }

  useEffect(
    function () {
      if (data) {
        form.reset({
          active: data.active,
          serviceName: data.serviceName.toUpperCase(),
          serviceRate: data.serviceRate,
          description: data.description?.toUpperCase() ?? undefined,
        });
      }
    },
    [data, form]
  );

  return (
    <div className="y-spacing">
      {errors ||
        (accountsError && (
          <ErrorAlert error={errors || accountsError?.message} />
        ))}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="eg Consultion services"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Rate</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="20000"
                    disabled={isPending}
                    value={field.value === 0 ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="description for service...optional"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingAccounts ? (
            <FormFieldLoading label="G/L Account" />
          ) : (
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>G/L Account</FormLabel>
                  <FormControl>
                    <CustomSearchSelect
                      options={accounts
                        .filter(acc => acc.parentId !== null)
                        .map(acc => ({ label: acc.label, value: acc.value }))}
                      {...field}
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
                        disabled={isPending}
                      />
                    </FormControl>
                    <Label htmlFor="active">
                      {form.watch('active') ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </FormItem>
              )}
            />
          )}

          <div className="space-x-2">
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <Button
              type="reset"
              variant="outline"
              onClick={() => reset(form)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
