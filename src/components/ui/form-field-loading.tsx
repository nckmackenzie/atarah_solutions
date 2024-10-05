import FormGroup from '@/components/ui/form-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function FormFieldLoading({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <FormGroup className={cn('', className)}>
      <Label>{label}</Label>
      <Skeleton className="w-full h-10" />
    </FormGroup>
  );
}
