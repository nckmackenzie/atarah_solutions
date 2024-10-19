import { z } from 'zod';
import { projectFormSchema } from '@/features/admin/schemas/project';
import { fetchProjects } from '@/features/admin/api/project';

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type Project = Awaited<ReturnType<typeof fetchProjects>>[number];
