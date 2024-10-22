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
import ReportLoading from '@/features/reports/components/report-loading';
import ClientStatementTable from '@/features/reports/components/client-statement-table';

import { useClients } from '@/features/admin/hooks/clients/use-clients';
import { useSetParams } from '@/hooks/use-set-params';
import { clientStatementReportSchema } from '@/features/reports/schema';
import { fetchClientStatement } from '@/features/reports/api';
import { dateFormat } from '@/lib/formatters';
import type {
  ClientStatementFormValues,
  ClientStatementParamValues,
} from '@/features/reports/types/index.types';

export default function ClientStatementPage() {
  const [reportValues, setReportValues] =
    useState<ClientStatementParamValues>();
  const { isLoading, data, error } = useQuery({
    queryKey: ['client statement', reportValues],
    queryFn: () => {
      if (!reportValues) return;
      return fetchClientStatement(reportValues);
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
                columnWidths={['w-24', 'w-32', 'w-12', 'w-12', 'w-12']}
              />
            ) : (
              <ClientStatementTable data={data || []} />
            )}
          </>
        )}
      </div>
    </ContentWrapper>
  );
}

interface ActionProps {
  onSetReportValues: React.Dispatch<
    React.SetStateAction<ClientStatementParamValues | undefined>
  >;
}

function Actions({ onSetReportValues }: ActionProps) {
  const [date, setRange] = useState<DateRange>();
  const setParams = useSetParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { clients, errorClients, isLoadingClients } = useClients();
  const form = useForm<ClientStatementParamValues>({
    defaultValues: {
      clientId: '',
    },
    resolver: zodResolver(clientStatementReportSchema),
  });
  const {
    formState: { errors },
  } = form;

  function onSubmit(values: ClientStatementFormValues) {
    setIsSubmitted(true);
    const reportParams = {
      from: dateFormat(date?.from as Date),
      to: dateFormat(date?.to as Date),
      ...values,
    };

    setParams(
      reportParams,
      Object.keys({ ...values, from: undefined, to: undefined })
    );
    onSetReportValues(reportParams);
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
                onChange={value => form.setValue('clientId', value)}
                value={form.watch('clientId')}
              />
              {errors?.clientId?.message && (
                <CustomFormMessage message={errors.clientId.message} />
              )}
            </div>
          </FormGroup>
        )}
        <div className="col-span-full">
          <Button type="submit">Preview</Button>
        </div>
      </form>
    </div>
  );
}
