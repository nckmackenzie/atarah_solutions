import { useLoaderData } from 'react-router-dom';
import { format } from 'date-fns';

import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton, Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useDocumentTitle } from '@/hooks/use-title';
import { dateFormat, numberFormat } from '@/lib/formatters';
import { supabase } from '@/lib/supabase/supabase';
import { useExportExcel } from '@/hooks/use-export-excel';

export default function RevenueDetailedPage() {
  useDocumentTitle('Revenue Detailed');
  const exportToExcel = useExportExcel(
    'revenue-detailed-' + format(new Date(), 'ddMMyyyyHHmmss')
  );
  const loaderData = useLoaderData() as Awaited<
    ReturnType<typeof revenueDetailedPageLoader>
  >;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        <h1 className="text-2xl font-bold">Revenue Detailed</h1>
        <Button
          variant="excel"
          onClick={() =>
            exportToExcel(
              loaderData.map(revenue => ({
                Client: revenue.name.toUpperCase(),
                Amount: revenue.amount,
              }))
            )
          }
        >
          Export To Excel
        </Button>
        <Table className="max-w-5xl mx-auto border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loaderData.map(revenue => (
              <TableRow key={revenue.name}>
                <TableCell>{revenue.name.toUpperCase()}</TableCell>
                <TableCell className="text-right">
                  {numberFormat(revenue.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="font-bold text-right">
                {numberFormat(
                  loaderData.reduce(
                    (acc, cur) => acc + parseFloat(cur.amount.toString()),
                    0
                  )
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </ContentWrapper>
  );
}

export async function revenueDetailedPageLoader({
  request,
}: {
  request: Request;
}) {
  const url = new URL(request.url);
  const account = url.searchParams.get('account');
  const from = url.searchParams.get('from')
    ? dateFormat(url.searchParams.get('from')!)
    : undefined;
  const to = url.searchParams.get('to')
    ? dateFormat(url.searchParams.get('to')!)
    : undefined;
  if (!account || !from || !to) throw new Error('Invalid parameters provided');
  const { data, error } = await supabase.rpc('get_revenues_detailed', {
    account,
    sdate: from,
    edate: to,
  });
  if (error) throw new Error(error.message);
  return data;
}
