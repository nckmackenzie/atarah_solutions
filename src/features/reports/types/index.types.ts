import { z } from 'zod';

import {
  fetchClientStatement,
  fetchCollectedPayments,
  fetchExpensesReport,
  fetchOutstandingInvoices,
} from '@/features/reports/api';
import {
  clientStatementReportSchema,
  expensesReportSchema,
  paymentReportSchema,
} from '@/features/reports/schema';

type ReportDates = {
  from: string;
  to: string;
};

export type OutstandingInvoice = Awaited<
  ReturnType<typeof fetchOutstandingInvoices>
>[number];

export type PaymentReportValues = z.infer<typeof paymentReportSchema>;
export type PaymentCollectionValues = ReportDates & PaymentReportValues;
export type PaymentCollection = Awaited<
  ReturnType<typeof fetchCollectedPayments>
>[number];

export type ExpenseReportFormValues = z.infer<typeof expensesReportSchema>;
export type ExpenseParamValues = ReportDates & ExpenseReportFormValues;
export type ExpenseReportItem = Awaited<
  ReturnType<typeof fetchExpensesReport>
>[number];

export type ClientStatementFormValues = z.infer<
  typeof clientStatementReportSchema
>;
export type ClientStatementParamValues = ReportDates &
  ClientStatementFormValues;
export type ClientStatementItem = Awaited<
  ReturnType<typeof fetchClientStatement>
>[number];
