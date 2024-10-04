import ContentWrapper from '@/components/layout/content-wrapper';
import PageCard from '@/components/ui/page-card';
import UsersDataTable from '@/features/admin/components/users/users-datatable';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchUsers } from '@/features/admin//api/user';

export default function UsersIndex() {
  const { data, isLoading, error } = usePageFetch('users', fetchUsers);
  return (
    <ContentWrapper>
      <div className="y-spacing">
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title="Users List"
          description="List of all created users."
          searchPlaceholder="Search by user name or email"
        >
          {isLoading ? (
            <TableSkeleton
              rowCount={10}
              columnWidths={['w-56', 'w-24', 'w-56', 'w-16', 'w-1']}
            />
          ) : (
            <UsersDataTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
