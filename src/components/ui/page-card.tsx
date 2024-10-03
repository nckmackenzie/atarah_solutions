import { type PropsWithChildren } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Search from '@/components/ui/search';

interface PageCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export default function PageCard({
  title,
  children,
  description,
  hasSearch = true,
  searchPlaceholder,
  className,
}: PageCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="y-spacing">
        {hasSearch && <Search placeholder={searchPlaceholder || 'Search...'} />}
        {children}
      </CardContent>
    </Card>
  );
}
