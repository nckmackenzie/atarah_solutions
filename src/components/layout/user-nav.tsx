import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import { useTheme } from '@/app/theme-provider';
import { useUser } from '@/features/auth/hooks/use-user';
import { supabase } from '@/lib/supabase/supabase';
import { getInitials } from '@/lib/utils';

export default function UserNav() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setTheme, theme } = useTheme();

  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.removeQueries();
      navigate('/login');
    },
    onError: error => {
      console.error(`🔥🔥LOGOUT ERROR: ${error.message}`);
      toast.error('😔Failed to log you out');
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/user.png" alt="Avatar" />
            <AvatarFallback className="bg-transparent">
              {user?.user_metadata?.name
                ? getInitials(user.user_metadata.name)
                : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user?.user_metadata?.name && (
              <p className="text-sm font-medium leading-none capitalize">
                {user?.user_metadata?.name || 'Jane Doe'}
              </p>
            )}
            {user?.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link className="w-full" to={'/profile'}>
            <User className="w-4 h-4 mr-2" />
            <span>Your Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            <span>Change Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4 mr-2" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4 mr-2" />
                <span>Dark</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => mutate()}
          disabled={isPending}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
