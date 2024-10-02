import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ErrorAlert } from '@/components/ui/custom-alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { dummyArray } from '@/lib/utils';
import { supabase } from '@/lib/supabase/supabase';
import { Form } from '@/types/index.types';

export default function Sidebar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const { data, error } = await supabase.from('forms').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    refetchInterval: false,
  });

  return (
    <aside className="fixed top-0 left-0 z-10 hidden h-screen bg-background md:block w-72">
      {/* BEFORE DARK THEME SET UP */}
      {/* <div className="h-full shadow-md"> */}
      <div className="h-full border-r">
        <div className="flex items-center justify-center border-b border-slate-100 dark:border-slate-900 h-14 ">
          <h1 className="text-lg font-semibold">Master Slices</h1>
        </div>
        <div className="p-4">
          {error && <ErrorAlert error={error.message} />}
          {isLoading && <UserNavSkeleton />}
          {data && <UserNav menu={data} />}
          {!isLoading && !error && !data?.length && (
            <p className="text-sm font-medium text-destructive">
              No forms selected for user
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function UserNavSkeleton() {
  return dummyArray(5).map((_, i) => (
    <div
      key={i}
      className="flex items-center justify-between py-4 border-b border-slate-100"
    >
      <Skeleton className="h-4 w-36" />
      <Skeleton className="size-4" />
    </div>
  ));
}

function UserNav({ menu }: { menu: Form[] }) {
  const uniqueMenu = [...new Set(menu.map(m => m.moduleName))];
  return (
    <div>
      <Accordion type="single" collapsible className="w-full px-2">
        {uniqueMenu.map(module => {
          const submenus = menu.filter(mn => mn.moduleName === module);
          return (
            <AccordionItem value={module} key={module}>
              <AccordionTrigger className="capitalize">
                {module}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col">
                  {submenus.map(sub => (
                    <li key={sub.formName}>
                      <Link
                        className="block px-4 py-2 text-sm capitalize transition-colors rounded text-muted-foreground hover:bg-gray-200 hover:dark:bg-gray-800 hover:text-neutral-foreground"
                        to={`/${sub.path}`}
                      >
                        {sub.formName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
