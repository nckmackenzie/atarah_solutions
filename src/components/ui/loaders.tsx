import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
      <div className="loader"></div>
    </div>
  );
}

export function PageLoader({
  loaderText,
  className,
}: {
  loaderText?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'h-[calc(100vh-3.5rem)] flex items-center justify-center',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <Loader2Icon className="size-8 animate-spin text-rose-300" />
        <span className="text-sm text-muted-foreground">
          {loaderText || 'Please wait...'}
        </span>
      </div>
    </div>
  );
}

export function BasicLoader() {
  return (
    <div className="flex flex-col items-center">
      <Loader2Icon className="size-8 animate-spin text-rose-300" />
      <span className="text-sm text-muted-foreground">Please wait...</span>
    </div>
  );
}
