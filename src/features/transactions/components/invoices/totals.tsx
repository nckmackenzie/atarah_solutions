import { type UseFormReturn } from 'react-hook-form';

import { Label } from '@/components/ui/label';

import { numberFormat } from '@/lib/formatters';
import { calculateVatValues } from '@/features/transactions/lib/utils';
import type { InvoiceFormValues } from '@/features/transactions/types/invoice.types';

export default function Totals({
  form,
}: {
  form: UseFormReturn<InvoiceFormValues>;
}) {
  const total = form
    .watch('items')
    .reduce((acc, item) => acc + Number(item.rate) * Number(item.qty), 0);
  const values = calculateVatValues(
    form.watch('vatType'),
    total,
    form.watch('vat') || 0
  );

  return (
    <div className="col-span-full flex flex-col items-end gap-2 ">
      <div className="grid w-full md:w-48 grid-cols-2 gap-2 items-center text-sm ">
        <Label className="font-semibold">Sub Total</Label>
        <div className="text-primary ml-auto">
          {numberFormat(values.exclusive)}
        </div>
      </div>
      <div className="grid w-full md:w-48 grid-cols-2 gap-2 items-center text-sm ">
        <Label className="font-semibold">VAT</Label>
        <div className="text-primary ml-auto">
          {numberFormat(values.vatValue)}
        </div>
      </div>
      <div className="grid w-full md:w-48 grid-cols-2 gap-2 items-center text-sm ">
        <Label className="font-semibold">Grand Total</Label>
        <div className="text-primary ml-auto">
          {numberFormat(values.inclusive)}
        </div>
      </div>
    </div>
  );
}
