import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <ScrollArea className="h-full ">
        <div className="px-6 py-4 space-y-2">{children}</div>
      </ScrollArea>
    </div>
  );
}
