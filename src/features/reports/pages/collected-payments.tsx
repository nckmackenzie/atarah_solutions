import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ContentWrapper from '@/components/layout/content-wrapper';
import CustomSearchSelect from '@/components/ui/custom-select';
import DateRangePicker from '@/components/ui/daterange';
import FormGroup from '@/components/ui/form-group';
import { Label } from '@/components/ui/label';
import { ErrorAlert } from '@/components/ui/custom-alert';
import FormFieldLoading from '@/components/ui/form-field-loading';
import { Button } from '@/components/ui/button';
import CustomFormMessage from '@/components/ui/custom-form-message';

import { useClients } from '@/features/admin/hooks/clients/use-clients';
import { useSetParams } from '@/hooks/use-set-params';
import { dateFormat } from '@/lib/formatters';
import { paymentReportSchema } from '@/features/reports/schema';
import type {
  PaymentCollectionValues,
  PaymentReportValues,
} from '@/features/reports/types/index.types';

import { fetchCollectedPayments } from '@/features/reports/api';
import ReportLoading from '../components/report-loading';
import CollectionReportTable from '../components/collection-report-table';
import { useDocumentTitle } from '@/hooks/use-title';

export default function CollectedPaymentsPage() {
  useDocumentTitle('Collected Payments');
  const [reportValues, setReportValues] = useState<PaymentCollectionValues>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment collection', reportValues],
    queryFn: () => {
      if (!reportValues) return;
      return fetchCollectedPayments(reportValues);
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
              <CollectionReportTable data={data || []} />
            )}
          </>
        )}
      </div>
    </ContentWrapper>
  );
}

interface ActionProps {
  onSetReportValues: React.Dispatch<
    React.SetStateAction<PaymentCollectionValues | undefined>
  >;
}

function Actions({ onSetReportValues }: ActionProps) {
  const [date, setRange] = useState<DateRange>();
  const setParams = useSetParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { clients, errorClients, isLoadingClients } = useClients();
  const form = useForm<PaymentReportValues>({
    defaultValues: {
      reportType: 'all',
      clientId: '',
    },
    resolver: zodResolver(paymentReportSchema),
  });
  const {
    formState: { errors },
  } = form;

  function onSubmit(values: PaymentReportValues) {
    setIsSubmitted(true);
    const reportParams = {
      from: dateFormat(date?.from as Date),
      to: dateFormat(date?.to as Date),
      ...values,
    };
    if (values.reportType === 'all') delete reportParams.clientId;

    setParams(
      reportParams,
      Object.keys({ ...values, from: undefined, to: undefined })
    );
    onSetReportValues({
      ...reportParams,
      clientId: values.reportType === 'all' ? undefined : values.clientId,
    });
  }

  return (
    <div className="space-y-2">
      {errorClients && <ErrorAlert error={errorClients.message} />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
        <div className="col-span-full md:col-span-4 self-end space-y-1">
          <DateRangePicker
            date={date}
            onSetDate={setRange}
            className="h-10 w-full"
          />
          {isSubmitted && !date && (
            <CustomFormMessage message="Select date range" />
          )}
        </div>
        <FormGroup className="space-y-1 col-span-full md:col-span-4">
          <Label className="text-xs text-muted-foreground font-normal">
            Report Type
          </Label>
          <div className="space-y-1">
            <CustomSearchSelect
              options={[
                { value: 'all', label: 'All' },
                { value: 'by-client', label: 'By Client' },
              ]}
              onChange={value =>
                form.setValue(
                  'reportType',
                  value as PaymentReportValues['reportType']
                )
              }
              value={form.watch('reportType')}
            />
            {errors?.reportType?.message && (
              <CustomFormMessage message={errors.reportType.message} />
            )}
          </div>
        </FormGroup>
        {isLoadingClients ? (
          <FormFieldLoading
            label="Client"
            className="col-span-full md:col-span-4"
          />
        ) : (
          <FormGroup className="space-y-1 col-span-full md:col-span-4">
            <Label className="text-xs text-muted-foreground font-normal">
              Client
            </Label>
            <div className="space-y-1">
              <CustomSearchSelect
                options={clients}
                disabled={form.watch('reportType') === 'all'}
                onChange={value => form.setValue('clientId', value)}
                value={
                  form.watch('reportType') === 'all'
                    ? ''
                    : form.watch('clientId')
                }
              />
              {errors?.clientId?.message && (
                <CustomFormMessage message={errors.clientId.message} />
              )}
            </div>
          </FormGroup>
        )}
        <Button type="submit">Preview</Button>
      </form>
    </div>
  );
}
