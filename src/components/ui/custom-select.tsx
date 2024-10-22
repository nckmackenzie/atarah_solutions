import { SearchSelect, SearchSelectItem } from '@tremor/react';
import { type Option } from '@/types/index.types';

interface CustomSearchSelectProps {
  options: Option[];
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  enableClear?: boolean;
}

export default function CustomSearchSelect({
  options,
  defaultValue,
  onChange,
  disabled,
  value,
  placeholder,
  enableClear = false,
}: CustomSearchSelectProps) {
  return (
    <SearchSelect
      disabled={disabled}
      onValueChange={onChange}
      enableClear={enableClear}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder || 'Select one...'}
    >
      {options.map(option => (
        <SearchSelectItem key={option.value} value={option.value}>
          {option.label}
        </SearchSelectItem>
      ))}
    </SearchSelect>
  );
}
