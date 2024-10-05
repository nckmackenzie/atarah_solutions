import ContentWrapper from '@/components/layout/content-wrapper';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { useDocumentTitle } from '@/hooks/use-title';

export default function ProfileIndexPage() {
  useDocumentTitle('My Profile');
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <ProfileForm />
      </div>
    </ContentWrapper>
  );
}
