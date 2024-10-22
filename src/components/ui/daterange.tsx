import { Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { useSetParams } from '@/hooks/use-set-params';

interface DateRangeProps {
  date: DateRange | undefined;
  onSetDate: Dispatch<SetStateAction<DateRange | undefined>>;
  setQueryParams?: boolean;
  className?: string;
}

export default function DateRangePicker({
  date,
  onSetDate,
  setQueryParams,
  className,
}: DateRangeProps) {
  const setParams = useSetParams();
  return (
    <div className={cn('grid gap-2')}>
      <div className="text-xs text-muted-foreground">Select Date Range</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            disabled={false}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              className,
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={range => {
              onSetDate(range);
              if (setQueryParams && range?.from && range?.to) {
                setParams({
                  from: format(range.from, 'yyyy-MM-dd'),
                  to: format(range.to, 'yyyy-MM-dd'),
                });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
