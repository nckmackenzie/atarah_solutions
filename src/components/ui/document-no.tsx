import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

export default function DocumentNo({
  isLoading,
  documentNumber,
  className,
  label,
}: {
  isLoading: boolean;
  documentNumber: string | number;
  className?: string;
  label?: string;
}) {
  if (isLoading)
    return (
      <div className={cn('', className)}>
        <div className="space-y-2">
          <Label>{label || 'Requisition No'}</Label>
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    );
  return (
    <div className={cn('', className)}>
      <div className="space-y-2">
        <Label>{label || 'Requisition No'}</Label>
        <div className="input">{documentNumber.toString()}</div>
      </div>
    </div>
  );
}
