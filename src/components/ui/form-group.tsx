import { type PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export default function FormGroup({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}
