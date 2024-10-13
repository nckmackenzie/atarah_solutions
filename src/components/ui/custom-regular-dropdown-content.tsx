import { Link } from 'react-router-dom';

import { CustomAlertDialog } from '@/components/ui/custom-alert-dialog';
import CustomDropdownContent from '@/components/ui/custom-dropdown-content';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { useDelete } from '@/hooks/use-delete';

interface CustomRegularDropdownContentProps {
  to: string;
  id: string;
  queryKey: string;
  deleteFn: (id: string) => Promise<void>;
}

function CustomRegularDropdownContent({
  to,
  id,
  queryKey,
  deleteFn,
}: CustomRegularDropdownContentProps) {
  const { destroy } = useDelete(queryKey, deleteFn);
  return (
    <CustomDropdownContent>
      <DropdownMenuItem asChild>
        <Link to={to}>Edit</Link>
      </DropdownMenuItem>
      <CustomAlertDialog onConfirm={() => destroy(id)}>
        <button className="delete-menu-item">Delete</button>
      </CustomAlertDialog>
    </CustomDropdownContent>
  );
}

export default CustomRegularDropdownContent;
