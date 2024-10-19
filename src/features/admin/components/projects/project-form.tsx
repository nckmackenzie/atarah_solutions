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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { projectFormSchema } from '@/features/admin/schemas/project';
import { useError } from '@/hooks/use-error';
import { useMutate } from '@/hooks/use-mutate';
import { useFormReset } from '@/hooks/use-form-reset';
import { createProject, updateProject } from '@/features/admin/api/project';
import type { IsEditRequired } from '@/types/index.types';
import type {
  Project,
  ProjectFormValues,
} from '@/features/admin/types/project.types';

interface ProjectFormProps extends IsEditRequired {
  data?: Project;
}

export default function ProjectForm({ isEdit, data }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      active: true,
      description: '',
      projectName: '',
    },
    resolver: zodResolver(projectFormSchema),
  });
  const { clearErrors, errors, onError } = useError();
  const reset = useFormReset<ProjectFormValues>();
  const { isPending, mutate } = useMutate(createProject, updateProject, {
    queryKey: 'projects',
    redirectPath: '/admin/projects',
  });

  useEffect(
    function () {
      if (data) {
        form.reset({
          active: data.active,
          description: data.description?.toUpperCase() ?? undefined,
          projectName: data.projectName.toUpperCase(),
        });
      }
    },
    [data, form]
  );

  function onSubmit(values: ProjectFormValues) {
    clearErrors();
    mutate(values, { onError: error => onError(error.message) });
  }
  return (
    <div className="space-y-4">
      {errors && <ErrorAlert error={errors} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Enter project name"
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
                    disabled={isPending}
                    {...field}
                    placeholder="Enter description...optional"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEdit && (
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        disabled={isPending}
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
          <div className="space-x-2">
            <Button disabled={isPending} type="submit">
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
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
