import ContentWrapper from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';

export default function PrintInvoicePage() {
  return (
    <ContentWrapper>
      <div className="space-y-4">
        <div className="space-x-2">
          <Button>
            <Printer className="icon mr-2" />
            <span>Print</span>
          </Button>
          <Button variant="destructive">
            <FileText className="icon mr-2" />
            <span>PDF</span>
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}
