import { MoreVertical } from 'lucide-react';

import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CustomDropdownTrigger() {
  return (
    <DropdownMenuTrigger asChild>
      <button className="more-btn">
        <MoreVertical className="icon-muted" />
      </button>
    </DropdownMenuTrigger>
  );
}
