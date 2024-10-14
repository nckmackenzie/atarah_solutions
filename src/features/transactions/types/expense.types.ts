import { z } from 'zod';

import { expenseFormSchema } from '@/features/transactions/schema/expense';
import { fetchExpenses } from '@/features/transactions/api/expense';
import type { WithId } from '@/types/index.types';

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export type Expense = ExpenseFormValues &
  WithId & {
    expenseNo: number;
  };

export type ExpenseIndexTableRow = Awaited<
  ReturnType<typeof fetchExpenses>
>[number];
