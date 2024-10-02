import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { PasswordInput } from '@/features/auth/components/password-input';

import { useError } from '@/hooks/use-error';
import { loginSchema } from '@/features/auth/schema/login-schema';
import { login as loginApi } from '@/features/auth/api';
import type { LoginFormValues } from '@/features/auth/types/index.types';

export default function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { errors, onError, clearErrors } = useError();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const { isPending, mutate: login } = useMutation({
    mutationFn: loginApi,
    onSuccess: user => {
      queryClient.setQueryData(['user'], user.user);
      navigate('/', { replace: true });
    },
    onError: error => {
      onError(error.message);
    },
  });

  async function onSubmit(values: LoginFormValues) {
    clearErrors();
    login(values);
  }

  return (
    <div className="flex items-center justify-center h-full mx-4 sm:mx-0">
      <div className="space-y-2">
        {/* <span className="inline-block text-center">🐫</span> */}
        <h1 className="text-xl font-bold tracking-tight text-center sm:text-3xl">
          {import.meta.env.VITE_APP_APP_NAME || 'acme'}
        </h1>
        <p className="text-xs sm:text-base text-muted-foreground">
          Welcome Back! Enter your credentials to access your account!
        </p>
        {errors && <ErrorAlert error={errors} title="Authentication Error" />}
        <Card className="w-full border rounded">
          <CardContent className="px-4 py-4 sm:px-6 md:py-6">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                          placeholder="Enter phone number"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Enter your password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="flex items-center w-full gap-2"
                  disabled={isPending}
                >
                  {isPending && <Loader className="size-4 animate-spin" />} Sign
                  In
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
