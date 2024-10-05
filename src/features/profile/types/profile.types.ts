import { z } from 'zod';

import { profileFormSchema } from '@/features/profile/schema/profile';

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
