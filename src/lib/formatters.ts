import { format } from 'date-fns';

export const flattenErrors = (error: Record<string, string[]>) => {
  return Object.values(error).flat();
};

export const titleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

export const formatDateLong = (date: Date | string) => {
  return format(new Date(date), 'PPP');
};

export const dateFormat = (date: Date | string) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDateReporting = (date: Date | string) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const extractValue = (value: string) => {
  return value.split('-')[0];
};

export const extractSelectedText = (value: string) => {
  return value.split('-')[1];
};

export function numberFormat(
  number: string | number,
  minimumFractionDigits = 2
) {
  return new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 2,
    minimumFractionDigits,
  }).format(Number(number));
}

export const compactNumberFormatter = (value: string | number) => {
  return new Intl.NumberFormat('en-KE', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Number(value));
};

export const fileSuffix = () => {
  return format(new Date(), 'ddMMyyyyhhmmss');
};
