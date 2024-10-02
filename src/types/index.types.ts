import { Database } from '@/lib/supabase/database.types';

export type Form = Database['public']['Tables']['forms']['Row'];
