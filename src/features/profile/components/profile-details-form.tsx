import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { useUser } from '@/features/auth/hooks/use-user';
import { profileFormSchema } from '@/features/profile/schema/profile';
import { useMutate } from '@/hooks/use-mutate';
import { updateProfile } from '@/features/profile/api/profile';
import { useError } from '@/hooks/use-error';
import type { ProfileFormValues } from '@/features/profile/types/profile.types';

export default function ProfileDetailsForm() {
  const { user } = useUser();
  const { clearErrors, errors, onError } = useError();
  const { isPending, mutate } = useMutate(updateProfile);
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      contact: user?.user_metadata.contact || '',
      email: user?.email || '',
      name: user?.user_metadata?.name.toUpperCase() || '',
    },
    resolver: zodResolver(profileFormSchema),
  });

  function onSubmit(values: ProfileFormValues) {
    clearErrors();
    mutate(values, { onError: err => onError(err.message) });
  }

  return (
    <div className="y-spacing">
      {errors && <ErrorAlert error={errors} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
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
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0700000000"
                        disabled={isPending}
                        maxLength={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button disabled={isPending} type="submit">
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
