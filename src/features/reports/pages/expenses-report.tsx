import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DateRange } from 'react-day-picker';

import ContentWrapper from '@/components/layout/content-wrapper';
import { ErrorAlert } from '@/components/ui/custom-alert';
import DateRangePicker from '@/components/ui/daterange';
import CustomFormMessage from '@/components/ui/custom-form-message';
import FormGroup from '@/components/ui/form-group';
import { Label } from '@/components/ui/label';
import CustomSearchSelect from '@/components/ui/custom-select';
import { Button } from '@/components/ui/button';
import FormFieldLoading from '@/components/ui/form-field-loading';
import ExpenseDataTable from '@/features/reports/components/expense-datatable';
import ReportLoading from '@/features/reports/components/report-loading';

import { expensesReportSchema } from '@/features/reports/schema';
import { useSetParams } from '@/hooks/use-set-params';
import { useAccounts } from '@/features/admin/hooks/accounts/use-accounts';
import { dateFormat } from '@/lib/formatters';
import { fetchExpensesReport } from '@/features/reports/api';
import type {
  ExpenseParamValues,
  ExpenseReportFormValues,
} from '@/features/reports/types/index.types';
import { useDocumentTitle } from '@/hooks/use-title';
import { useProjects } from '@/features/admin/hooks/projects/use-projects';

export default function ExpensesReportPage() {
  useDocumentTitle('Expenses Report');
  const [reportValues, setReportValues] = useState<ExpenseParamValues>();
  const { isLoading, data, error } = useQuery({
    queryKey: ['expenses report', reportValues],
    queryFn: () => {
      if (!reportValues) return;
      return fetchExpensesReport(reportValues);
    },
    enabled: Boolean(reportValues),
  });

  return (
    <ContentWrapper>
      <div className="y-spacing">
        <Actions onSetReportValues={setReportValues} />
        {error && <ErrorAlert error={error.message} />}
        {reportValues && (
          <>
            {isLoading ? (
              <ReportLoading
                columnWidths={['w-24', 'w-56', 'w-12', 'w-24', 'w-16']}
              />
            ) : (
              <ExpenseDataTable data={data || []} />
            )}
          </>
        )}
      </div>
    </ContentWrapper>
  );
}

interface ActionProps {
  onSetReportValues: React.Dispatch<
    React.SetStateAction<ExpenseParamValues | undefined>
  >;
}

function Actions({ onSetReportValues }: ActionProps) {
  const [date, setRange] = useState<DateRange>();
  const setParams = useSetParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { expenseAccounts, isLoadingAccounts, accountsError } = useAccounts();
  const { isLoadingProjects, projects, projectsError } = useProjects();

  const form = useForm<ExpenseReportFormValues>({
    defaultValues: {
      reportType: 'all',
      projectId: '',
    },
    resolver: zodResolver(expensesReportSchema),
  });
  const {
    formState: { errors },
  } = form;

  function onSubmit(values: ExpenseReportFormValues) {
    setIsSubmitted(true);
    const reportParams = {
      from: dateFormat(date?.from as Date),
      to: dateFormat(date?.to as Date),
      ...values,
    };
    if (values.reportType === 'all') {
      delete reportParams.projectId;
      delete reportParams.accountId;
    }

    setParams(
      {
        ...reportParams,
        accountId:
          values.reportType === 'by-account'
            ? (values.accountId?.toString() as string)
            : '',
      },
      Object.keys({ ...values, from: undefined, to: undefined })
    );
    onSetReportValues({
      ...reportParams,
      projectId:
        values.reportType === 'by-project' ? values.projectId : undefined,
      accountId:
        values.reportType === 'by-account' ? values.accountId : undefined,
    });
  }

  return (
    <div className="space-y-2">
      {(accountsError || projectsError) && (
        <ErrorAlert
          error={
            accountsError?.message || projectsError?.message || 'Some message'
          }
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
        <div className="col-span-full md:col-span-3 self-end space-y-1">
          <DateRangePicker
            date={date}
            onSetDate={setRange}
            className="h-10 w-full"
          />
          {isSubmitted && !date && (
            <CustomFormMessage message="Select date range" />
          )}
        </div>
        <FormGroup className="space-y-1 col-span-full md:col-span-3">
          <Label className="text-xs text-muted-foreground font-normal">
            Report Type
          </Label>
          <div className="space-y-1">
            <CustomSearchSelect
              options={[
                { value: 'all', label: 'All' },
                { value: 'by-account', label: 'By Account' },
                { value: 'by-project', label: 'By Project' },
              ]}
              onChange={value =>
                form.setValue(
                  'reportType',
                  value as ExpenseReportFormValues['reportType']
                )
              }
              value={form.watch('reportType')}
            />
            {errors?.reportType?.message && (
              <CustomFormMessage message={errors.reportType.message} />
            )}
          </div>
        </FormGroup>
        {isLoadingAccounts ? (
          <FormFieldLoading
            label="Expense Account"
            className="col-span-full md:col-span-3"
          />
        ) : (
          <FormGroup className="space-y-1 col-span-full md:col-span-3">
            <Label className="text-xs text-muted-foreground font-normal">
              Expense Account
            </Label>
            <div className="space-y-1">
              <CustomSearchSelect
                options={expenseAccounts}
                disabled={form.watch('reportType') !== 'by-account'}
                onChange={value => form.setValue('accountId', +value)}
                value={
                  form.watch('reportType') !== 'by-account'
                    ? undefined
                    : form.watch('accountId')?.toString()
                }
              />
              {errors?.accountId?.message && (
                <CustomFormMessage message={errors.accountId.message} />
              )}
            </div>
          </FormGroup>
        )}
        {isLoadingProjects ? (
          <FormFieldLoading
            label="Project"
            className="col-span-full md:col-span-3"
          />
        ) : (
          <FormGroup className="space-y-1 col-span-full md:col-span-3">
            <Label className="text-xs text-muted-foreground font-normal">
              Project
            </Label>
            <div className="space-y-1">
              <CustomSearchSelect
                options={projects}
                disabled={form.watch('reportType') !== 'by-project'}
                onChange={value => form.setValue('projectId', value)}
                value={
                  form.watch('reportType') !== 'by-project'
                    ? undefined
                    : form.watch('projectId')?.toString()
                }
              />
              {errors?.projectId?.message && (
                <CustomFormMessage message={errors.projectId.message} />
              )}
            </div>
          </FormGroup>
        )}
        <Button type="submit">Preview</Button>
      </form>
    </div>
  );
}
