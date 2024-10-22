import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

import ContentWrapper from '@/components/layout/content-wrapper';
import { Button } from '@/components/ui/button';
import CustomFormMessage from '@/components/ui/custom-form-message';
import DateRangePicker from '@/components/ui/daterange';

import { useSetParams } from '@/hooks/use-set-params';
import { dateFormat } from '@/lib/formatters';

export default function IncomeStatementPage() {
  const [date, setDate] = useState<DateRange>();
  const [submitted, setSubmitted] = useState(false);
  const setParams = useSetParams();

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
      </div>
    </ContentWrapper>
  );
}
