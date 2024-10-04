import { z } from 'zod';

import { userFormSchema } from '@/features/admin/schemas/user';
import type { Database } from '@/lib/supabase/database.types';

export type User = Database['public']['Tables']['profiles']['Row'];

export type UserFormValues = z.infer<typeof userFormSchema>;
