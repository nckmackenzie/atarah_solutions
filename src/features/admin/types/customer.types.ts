import { z } from 'zod';

import { customerFormSchema } from '@/features/admin/schemas/customer';
import { Database } from '@/lib/supabase/database.types';

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export type Customer = Omit<
  Database['public']['Tables']['clients']['Row'],
  'openingBalance' | 'openingBalanceDate'
>;
