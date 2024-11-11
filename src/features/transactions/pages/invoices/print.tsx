import { useRef } from 'react';
import { Printer } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';
import InvoicePrint from '@/features/transactions/components/invoices/invoice-print';

import { useDocumentTitle } from '@/hooks/use-title';
import { useFetchSingle } from '@/hooks/use-fetch-single';
import { fetchInvoiceWithDetails } from '@/features/transactions/api/invoice';

export default function PrintInvoicePage() {
  useDocumentTitle('Print Invoice');
  const { data, error, isLoading } = useFetchSingle(
    'invoice print',
    fetchInvoiceWithDetails
  );
  const printRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <PageLoader loaderText="Fetching invoice details" />;

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;

    if (!printContents) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Print</title>');

    Array.from(document.styleSheets).forEach(styleSheet => {
      if (styleSheet.href) {
        printWindow.document.write(
          `<link rel="stylesheet" type="text/css" href="${styleSheet.href}">`
        );
      } else if (styleSheet.cssRules) {
        const style = document.createElement('style');
        Array.from(styleSheet.cssRules).forEach(rule => {
          style.appendChild(document.createTextNode(rule.cssText));
        });
        printWindow.document.head.appendChild(style);
      }
    });

    const printStyle = `
        <style>
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            h2 {
              background-color: #3E240F !important;
            }
          }
        </style>
    `;

    printWindow.document.write(printStyle);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.print();
    // printWindow.close();
  };

  if (!data) return <ErrorAlert error="Invoice not found" />;

  return (
    <ContentWrapper>
      <div className="space-y-4">
        <div className="space-x-2">
          <Button onClick={handlePrint}>
            <Printer className="icon mr-2" />
            <span>Print</span>
          </Button>
          {/* <Button variant="destructive">
            <FileText className="icon mr-2" />
            <span>PDF</span>
          </Button> */}
        </div>
        {error && <ErrorAlert error={error.message} />}
        <div className="max-w-5xl">
          <div className="p4" id="print-document space-y-4" ref={printRef}>
            <InvoicePrint details={data} />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
