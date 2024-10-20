import { useFieldArray, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import CustomSearchSelect from '@/components/ui/custom-select';
import { Label } from '@/components/ui/label';
import FormGroup from '@/components/ui/form-group';
import { toast } from 'sonner';
import FormFieldLoading from '@/components/ui/form-field-loading';
import { Input } from '@/components/ui/input';

import { useService } from '@/features/admin/hooks/services/use-service';
import { fetchServiceDetails } from '@/features/transactions/api/invoice';
import { numberFormat } from '@/lib/formatters';
import type { InvoiceFormValues } from '@/features/transactions/types/invoice.types';
import type { IsPending } from '@/types/index.types';

interface InvoiceItemsProps extends IsPending {
  form: UseFormReturn<InvoiceFormValues>;
  onError: (value: string | string[]) => void;
}

export default function InvoiceItems({
  form,
  isPending,
  onError,
}: InvoiceItemsProps) {
  const { isLoading, services } = useService();
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  const {
    formState: { errors },
  } = form;

  async function handleChange(value: string, index: number) {
    const isAdded = form
      .getValues('items')
      .some(item => item.serviceId === value);
    if (isAdded) {
      toast.error('Service already added');
      return;
    }
    form.setValue(`items.${index}.serviceId`, value);

    try {
      const details = await fetchServiceDetails(value);

      form.setValue(`items.${index}.rate`, details.serviceRate);
      form.setValue(`items.${index}.accountId`, details.accountId);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      }
    }
  }

  return (
    <div className="space-y-4 col-span-full">
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          append({
            serviceId: '',
            qty: 1,
            rate: 0,
            id: new Date().getTime().toString(),
            accountId: 0,
          })
        }
      >
        Add Service
      </Button>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-md grid md:grid-cols-12 gap-4"
        >
          {isLoading ? (
            <FormFieldLoading label="Service" className="form-col" />
          ) : (
            <FormGroup className="form-col">
              <Label>Service</Label>
              <div className="space-y-1">
                <CustomSearchSelect
                  options={services}
                  value={form.watch(`items.${index}.serviceId`)}
                  onChange={(value: string) => handleChange(value, index)}
                  placeholder="Select service"
                  disabled={isPending}
                />
                {errors.items?.[index]?.serviceId && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.items[index]?.serviceId?.message}
                  </p>
                )}
              </div>
            </FormGroup>
          )}
          <FormGroup className="col-span-2">
            <Label>Qty</Label>
            <div className="space-y-1">
              <Input
                {...form.register(`items.${index}.qty`)}
                disabled={isPending}
              />
            </div>
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label>Rate</Label>
            <div className="space-y-1">
              <Input
                {...form.register(`items.${index}.rate`)}
                disabled={isPending}
              />
            </div>
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label>Amount</Label>
            <div className="space-y-1">
              <Input
                readOnly
                value={numberFormat(
                  Number(form.watch(`items.${index}.qty`)) *
                    Number(form.watch(`items.${index}.rate`))
                )}
              />
            </div>
          </FormGroup>
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
