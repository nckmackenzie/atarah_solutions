import { z } from 'zod';

import { glAccountSchema } from '@/features/admin/schemas/glaccounts';
import { fetchAccounts } from '@/features/admin/api/glaccounts';

export type GlAccountFormValues = z.infer<typeof glAccountSchema>;

export type GlAccount = Awaited<ReturnType<typeof fetchAccounts>>[number];
