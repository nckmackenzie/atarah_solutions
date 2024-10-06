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
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// import { dateFormat } from '@/lib/formatters';
import { useMutate } from '@/hooks/use-mutate';
import { createClient, updateClient } from '@/features/admin/api/customer';
import { useFormReset } from '@/hooks/use-form-reset';
import { useError } from '@/hooks/use-error';
import { customerFormSchema } from '@/features/admin/schemas/customer';
import type { IsEditRequired } from '@/types/index.types';
import type {
  Customer,
  CustomerFormValues,
} from '@/features/admin/types/customer.types';

interface ClientFormProps extends IsEditRequired {
  data?: Customer;
}

export default function ClientForm({ isEdit, data }: ClientFormProps) {
  const { isPending, mutate } = useMutate(createClient, updateClient, {
    queryKey: 'clients',
    redirectPath: '/admin/customers',
  });
  const reset = useFormReset<CustomerFormValues>();
  const { clearErrors, onError, errors } = useError();

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      address: '',
      contact: '',
      email: '',
      name: '',
      taxPin: '',
      openingBalance: 0,
      active: true,
    },
    resolver: zodResolver(customerFormSchema),
  });

  useEffect(
    function () {
      if (data) {
        form.reset({
          active: data.active,
          address: data.address ?? undefined,
          contact: data.contact ?? undefined,
          email: data.email ?? undefined,
          name: data.name.toUpperCase(),
          taxPin: data.taxPin ?? undefined,
        });
      }
    },
    [form, data]
  );

  function onSubmit(values: CustomerFormValues) {
    clearErrors();
    mutate(values, { onError: error => onError(error.message) });
  }

  return (
    <div className="y-spacing">
      {errors && <ErrorAlert error={errors} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="form-col">
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Client Name"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="form-col">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="test@example.com"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="form-col">
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="0700000000"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxPin"
            render={({ field }) => (
              <FormItem className="form-col">
                <FormLabel>Tax PIN</FormLabel>
                <FormControl>
                  <Input
                    maxLength={11}
                    {...field}
                    placeholder="P123456789X"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Client address"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {!isEdit && (
            <>
              {' '}
              <FormField
                control={form.control}
                name="openingBalance"
                render={({ field }) => (
                  <FormItem className="form-col">
                    <FormLabel>Opening Balance</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        placeholder="20000"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingBalanceDate"
                render={({ field }) => (
                  <FormItem className="form-col">
                    <FormLabel>Opening Balance as of</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? dateFormat(field.value) : ''}
                        disabled={
                          !form.watch('openingBalance') ||
                          form.watch('openingBalance') === 0 ||
                          isPending
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )} */}
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
