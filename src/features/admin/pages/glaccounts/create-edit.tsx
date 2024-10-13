import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import GlAccountsForm from '@/features/admin/components/glaccounts/account';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { fetchAccount } from '@/features/admin/api/glaccounts';
import type { IsEdit } from '@/types/index.types';

export default function CreateEditAccounts({ isEdit }: IsEdit) {
  const { data, error, isLoading } = useFetchSingle('gl account', fetchAccount);
  if (isLoading) return <PageLoader loaderText="Fetching account details..." />;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit GL Account' : 'Create new G/L Account'}
          hasSearch={false}
          className="max-w-xl mx-4 md:mx-auto"
        >
          <GlAccountsForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
