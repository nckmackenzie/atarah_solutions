import { z } from 'zod';

export const paymentReportSchema = z
  .object({
    reportType: z.enum(['all', 'by-client'], {
      required_error: 'Report type is required',
    }),
    clientId: z.string().optional(),
  })
  .superRefine(({ reportType, clientId }, ctx) => {
    if (reportType === 'by-client' && !clientId) {
      ctx.addIssue({
        code: 'custom',
        path: ['clientId'],
        message: 'Client is required',
      });
    }
  });

export const expensesReportSchema = z
  .object({
    reportType: z.enum(['all', 'by-account', 'by-project'], {
      required_error: 'Report type is required',
    }),
    projectId: z.string().optional(),
    accountId: z.coerce.number().optional(),
  })
  .superRefine(({ reportType, projectId, accountId }, ctx) => {
    if (reportType !== 'by-project' && !projectId) {
      ctx.addIssue({
        code: 'custom',
        path: ['projectId'],
        message: 'Project is required',
      });
    }
    if (reportType === 'by-account' && !accountId) {
      ctx.addIssue({
        code: 'custom',
        path: ['accountId'],
        message: 'Account is required',
      });
    }
  });

export const clientStatementReportSchema = z.object({
  clientId: z
    .string({ required_error: 'Client is required' })
    .min(1, 'Client is required'),
});
