import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { type DateRange } from 'react-day-picker';

import ContentWrapper from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import CustomFormMessage from '@/components/ui/custom-form-message';
import DateRangePicker from '@/components/ui/daterange';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { useSetParams } from '@/hooks/use-set-params';
import { dateFormat, numberFormat } from '@/lib/formatters';
import { fetchIncomeStatement } from '@/features/reports/api';
import type { IncomeStatement } from '@/features/reports/types/index.types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function IncomeStatementPage() {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState<DateRange>();
  const [submitted, setSubmitted] = useState(false);
  const setParams = useSetParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const paramsSet = !!from && !!to;

  const { data, error, isLoading } = useQuery({
    queryKey: ['income statement', { from, to }],
    queryFn: () =>
      fetchIncomeStatement({ from: dateFormat(from!), to: dateFormat(to!) }),
    enabled: paramsSet,
  });

  console.log(data);

  function handleClick() {
    setSubmitted(true);
    if (!date) return;
    setParams({
      from: dateFormat(date.from as Date),
      to: dateFormat(date.to as Date),
    });
  }

  return (
    <ContentWrapper>
      <div className="y-spacing">
        <div className="space-y-2">
          <div className="space-y-1">
            <DateRangePicker date={date} onSetDate={setDate} />
            {!date && submitted && (
              <CustomFormMessage message="Select the date range" />
            )}
          </div>
          <Button onClick={handleClick}>Preview</Button>
        </div>
        {error && <ErrorAlert error={error.message} />}
        {paramsSet &&
          (isLoading ? (
            <TableSkeleton rowCount={10} columnWidths={['w-36', 'w-32']} />
          ) : data ? (
            <IncomeStatementTable data={data} />
          ) : null)}
      </div>
    </ContentWrapper>
  );
}

function IncomeStatementTable({ data }: { data: IncomeStatement }) {
  const revenueTotal = data.incomes.reduce(
    (acc, cur) => acc + Number(cur.credit),
    0
  );
  const expenseTotal = data.expenses.reduce(
    (acc, cur) => acc + Number(cur.credit),
    0
  );
  const profitLoss = revenueTotal - expenseTotal;
  return (
    <Table className="w-full md:w-1/2 mx-auto">
      <TableHeader className="bg-secondary">
        <TableRow>
          <TableHead colSpan={2}>Income Statement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-emerald-200 dark:bg-emerald-800">
          <TableCell colSpan={2}>Revenues</TableCell>
        </TableRow>
        {data.incomes.map(inc => (
          <TableRow key={inc.parentAccount}>
            <TableCell className="uppercase text-xs">
              {inc.parentAccount}
            </TableCell>
            <TableCell className="text-right text-xs font-semibold">
              {numberFormat(inc.credit)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="font-semibold text-sm">
            Revenues Total
          </TableCell>
          <TableCell className="text-right font-semibold text-sm">
            {numberFormat(revenueTotal)}
          </TableCell>
        </TableRow>
        <TableRow className="bg-rose-200 dark:bg-rose-800">
          <TableCell colSpan={2}>Expenses</TableCell>
        </TableRow>
        {data.expenses.map(exp => (
          <TableRow key={exp.parentAccount}>
            <TableCell className="uppercase text-xs">
              {exp.parentAccount}
            </TableCell>
            <TableCell className="text-right text-xs font-semibold">
              {numberFormat(exp.credit)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="font-semibold text-sm">
            Expenses Total
          </TableCell>
          <TableCell className="text-right font-semibold text-sm">
            {numberFormat(expenseTotal)}
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter className="bg-transparent border-b">
        <TableRow>
          <TableCell>Profit/Loss</TableCell>
          <TableCell
            className={cn(
              'text-right',
              profitLoss < 0 ? 'text-rose-500' : 'text-emerald-500'
            )}
          >
            {numberFormat(profitLoss)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
