import { z } from 'zod';
import { loginSchema } from '@/features/auth/schema/login-schema';

export type LoginFormValues = z.infer<typeof loginSchema>;
