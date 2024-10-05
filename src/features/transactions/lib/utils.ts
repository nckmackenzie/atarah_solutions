import type { VatType } from '@/features/transactions/types/invoice.types';

export function calculateVatValues(
  type: VatType,
  value: string | number,
  vat: string | number
) {
  const netValue = typeof value === 'string' ? parseFloat(value) : value;
  if (type === 'no_vat') {
    return { exclusive: netValue, vatValue: 0, inclusive: netValue };
  } else if (type === 'exclusive') {
    const convertedVat =
      typeof vat === 'string' ? parseFloat(vat) / 100 : vat / 100;
    const vatValue = convertedVat * netValue;
    const inclusive = vatValue + netValue;
    return { exclusive: netValue, vatValue, inclusive };
  } else {
    const convertedVat =
      typeof vat === 'string' ? parseFloat(vat) / 100 : vat / 100;
    const exclusive = netValue / (convertedVat + 1);
    const vatValue = netValue - exclusive;
    return { exclusive, vatValue, inclusive: netValue };
  }
}
