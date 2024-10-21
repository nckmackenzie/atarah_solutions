import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function ReportLoading({
  columnWidths,
}: {
  columnWidths: string[];
}) {
  return (
    <div className="space-y-4">
      <Skeleton className="w-32 h-9" />
      <TableSkeleton rowCount={10} columnWidths={columnWidths} />
    </div>
  );
}
