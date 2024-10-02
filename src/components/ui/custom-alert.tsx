import React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { OctagonX } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border-2 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-rose-200 bg-rose-100 dark:bg-rose-800 text-slate-950 dark:border-destructive dark:text-slate-50 [&>svg]:text-destructive',
        success:
          'border-emerald-100/50 bg-emerald-100 dark:bg-emerald-800 text-slate-950 dark:text-emerald-100 ',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    className={cn(alertVariants({ variant }), className)}
    ref={ref}
    {...props}
    role="alert"
  >
    {props.children}
  </div>
));

Alert.displayName = 'Alert';

export { Alert };

interface ErrorAlertProps {
  title?: string;
  description: string;
}

export const ErrorAlert = ({ description, title }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="flex items-center gap-4">
      <div className="bg-rose-500 size-8 grid place-content-center rounded-full">
        <OctagonX className="size-5 text-white" />
      </div>
      <div className="space-y-1">
        <h5 className="font-medium leading-none tracking-tight">
          {title || 'Error!!'}
        </h5>
        <p className="text-xs [&_p]:leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </Alert>
  );
};
