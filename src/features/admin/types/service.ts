import { z } from 'zod';

import { serviceFormSchema } from '@/features/admin/schemas/service';
import { Database } from '@/lib/supabase/database.types';

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export type Service = Database['public']['Tables']['services']['Row'];
