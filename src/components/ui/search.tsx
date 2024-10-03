import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import { cn } from '@/lib/utils';

interface SearchProps {
  placeholder: string;
  className?: string;
  allowOnlySearch?: boolean;
  parentClassName?: string;
}

export default function Search({
  placeholder,
  className,
  allowOnlySearch,
  parentClassName,
}: SearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = useDebounceCallback((term: string) => {
    if (term) {
      searchParams.set('search', term);
    } else {
      searchParams.delete('search');
    }

    if (allowOnlySearch) {
      searchParams.forEach((_, key) => {
        if (key !== 'search') searchParams.delete(key);
      });
    }

    setSearchParams(searchParams);
  }, 500);

  return (
    <div className={cn('relative flex flex-1 flex-shrink-0', parentClassName)}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className={cn(
          'bg-background peer block w-full md:w-96 rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500',
          className
        )}
        onChange={e => handleSearch(e.target.value)}
        placeholder={placeholder}
        defaultValue={searchParams.get('search')?.toString()}
        type="search"
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
