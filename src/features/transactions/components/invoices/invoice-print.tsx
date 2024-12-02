import { format } from 'date-fns';

import Logo from '@/assets/atarah_logo.png';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { dummyArray } from '@/lib/utils';
import { numberFormat } from '@/lib/formatters';
import type { SingleInvoicePrintDetails } from '@/features/transactions/types/invoice.types';
import { Separator } from '@/components/ui/separator';

interface InvoicePrintProps {
  details: SingleInvoicePrintDetails;
}

export default function InvoicePrint({ details }: InvoicePrintProps) {
  return (
    <div className="space-y-4">
      <Header />
      <InvoiceDetails
        invoiceNo={details.invoiceNo}
        invoiceDate={new Date(details.invoiceDate)}
        clientName={details.client}
        details={details.details}
        exclusiveAmount={details.exclusiveAmount}
        vatAmount={details.vatAmount}
        inclusiveAmount={details.inclusiveAmount || 0}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="flex justify-between items-center border-b border-rose-500">
      <img
        src={Logo}
        alt="Atarah solutions logo"
        className="aspect-auto w-64 object-left"
      />
      <div className="space-y-2 text-xs text-gray-700">
        <div className="space-y-1">
          <p>P.O Box 35211-00100</p>
          <p>Nairobi, Kenya</p>
        </div>
        <div className="mt-2">
          <p>+254 721 442 223</p>
          <p>+254 734 442 223</p>
        </div>
      </div>
    </header>
  );
}

interface InvoiceDetailsProps {
  invoiceNo: string;
  invoiceDate: Date;
  clientName: string;
  details: SingleInvoicePrintDetails['details'];
  exclusiveAmount: number;
  vatAmount: number;
  inclusiveAmount: number;
}

function InvoiceDetails({
  invoiceNo,
  invoiceDate,
  clientName,
  details,
  exclusiveAmount,
  vatAmount,
  inclusiveAmount,
}: InvoiceDetailsProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-2xl font-bold">TAX INVOICE</h1>
      <div className="flex flex-col gap-y-1 items-end">
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Invoice No:</div>
            <div>{invoiceNo}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Invoice Date:</div>
            <div>{format(invoiceDate, 'dd/MM/yyyy')}</div>
          </div>
        </div>
      </div>
      <div className="font-semibold">
        <p>TO: THE MANAGER</p>
        <p className="uppercase">{clientName}</p>
      </div>
      <InvoiceTable
        details={details}
        exclusiveAmount={exclusiveAmount}
        vatAmount={vatAmount}
        inclusiveAmount={inclusiveAmount}
      />
      <Notes />
    </div>
  );
}

interface InvoiceTableProps {
  details: SingleInvoicePrintDetails['details'];
  exclusiveAmount: number;
  vatAmount: number;
  inclusiveAmount: number;
}

function InvoiceTable({
  details,
  exclusiveAmount,
  vatAmount,
  inclusiveAmount,
}: InvoiceTableProps) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Qty</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {details.map(dt => (
          <TableRow key={dt.id}>
            <TableCell>{dt.qty}</TableCell>
            <TableCell className="uppercase">{dt.serviceName}</TableCell>
            <TableCell className="text-right">
              {numberFormat(dt.rate)}
            </TableCell>
            <TableCell className="text-right">
              {numberFormat(dt.amount)}
            </TableCell>
          </TableRow>
        ))}
        {dummyArray(8 - details.length).map((_, index) => (
          <TableRow key={index}>
            <TableCell>&nbsp;</TableCell>
            <TableCell>&nbsp;</TableCell>
            <TableCell>&nbsp;</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">
            Sub Total
          </TableCell>
          <TableCell className="text-right font-semibold">
            {numberFormat(exclusiveAmount)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">
            VAT Amount
          </TableCell>
          <TableCell className="text-right font-semibold">
            {numberFormat(vatAmount)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">
            Total Due
          </TableCell>
          <TableCell className="text-right font-semibold">
            {numberFormat(inclusiveAmount)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function Notes() {
  return (
    <div className="border border-gray-500 p-4 text-sm space-y-0.5">
      <p>
        Kindly make payments to{' '}
        <span className="font-semibold">Atarah Solutions Limited</span>
      </p>
      <p className="font-semibold">ACCOUNT NO: 01192952546400</p>
      <p className="font-semibold">BANK NAME: CO-OPERATIVE BANK</p>
      <p className="font-semibold">BRANCH: ENTERPRISE ROAD</p>
      <Separator />
      <p className="font-semibold">PIN NO: P051802048C</p>
      <p className="text-sm text-muted-foreground">
        If you have any questions regarding this invoice, please contact us at{' '}
        <span className="font-semibold">grace@atarahsolutions.co.ke</span>
      </p>
      <p className="text-sm text-center text-muted-foreground">
        Thank you for your business.
      </p>
    </div>
  );
}
