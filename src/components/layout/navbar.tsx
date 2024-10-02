import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UserNav from '@/components/layout/user-nav';

export default function Navbar() {
  return (
    <header className="flex items-center px-4 border-b h-14 bg-background sm:px-8">
      <Button variant="ghost" size="icon" className="block md:hidden">
        <Menu className="text-muted-foreground size-4" />
      </Button>
      <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
}
