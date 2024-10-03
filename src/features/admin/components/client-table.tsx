import type { Customer } from '@/features/admin/types/customer.types';

interface ClientTableProps {
  data: Customer[];
}
export default function ClientTable({ data }: ClientTableProps) {
  return <div>ClientTable</div>;
}
