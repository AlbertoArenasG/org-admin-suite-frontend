'use client';

import { getCountryCallingCode, type Country } from 'react-phone-number-input';
import PhoneNumberInput from 'react-phone-number-input/input';
import flags from 'react-phone-number-input/flags';
import { forwardRef, useEffect, useState, type ComponentProps } from 'react';

import { FormCombobox, type FormSelectOption } from '@/components/forms/FormCombobox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PhoneValue = {
  countryCode: string;
  number: string;
};

type PhoneInputProps = {
  id?: string;
  value: PhoneValue;
  onValueChange: (value: PhoneValue) => void;
  countries?: readonly Country[];
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  countryPlaceholder: string;
  countrySearchPlaceholder: string;
  emptyCountryMessage: string;
  countryLabels: Partial<Record<Country, string>>;
};

const DEFAULT_COUNTRIES = ['MX', 'US', 'CA'] as const satisfies readonly Country[];

const NumberInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <Input className={cn('rounded-l-none border-l-0 text-sm', className)} ref={ref} {...props} />
  )
);
NumberInput.displayName = 'PhoneNumberInput';

function getCountryFromCode(countryCode: string, countries: readonly Country[]): Country {
  return (
    countries.find((country) => `+${getCountryCallingCode(country)}` === countryCode) ??
    countries[0] ??
    'MX'
  );
}

function PhoneInput({
  countries = DEFAULT_COUNTRIES,
  countryPlaceholder,
  countrySearchPlaceholder,
  countryLabels,
  disabled,
  emptyCountryMessage,
  invalid,
  id,
  onValueChange,
  placeholder,
  value,
}: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(() =>
    getCountryFromCode(value.countryCode, countries)
  );
  const countryCode = `+${getCountryCallingCode(country)}`;
  const internationalValue = value.number
    ? `${countryCode}${value.number.replace(/\D/g, '')}`
    : undefined;
  const countryOptions: FormSelectOption[] = countries.map((countryOption) => ({
    value: countryOption,
    label: `${countryLabels[countryOption] ?? countryOption} +${getCountryCallingCode(countryOption)}`,
  }));

  useEffect(() => {
    setCountry(getCountryFromCode(value.countryCode, countries));
  }, [countries, value.countryCode]);

  return (
    <div className="flex w-full">
      <div className="w-28 shrink-0 [&_button]:rounded-r-none [&_button]:border-r-0">
        <FormCombobox
          disabled={disabled}
          emptyMessage={emptyCountryMessage}
          invalid={invalid}
          onValueChange={(nextCountry) => {
            const resolvedCountry = (nextCountry ?? country) as Country;
            setCountry(resolvedCountry);
            onValueChange({
              countryCode: `+${getCountryCallingCode(resolvedCountry)}`,
              number: value.number,
            });
          }}
          options={countryOptions}
          placeholder={countryPlaceholder}
          renderOption={(option) => (
            <CountryOption country={option.value as Country} label={option.label} />
          )}
          renderValue={(option) => (
            <CountryOption
              country={option.value as Country}
              label={`+${getCountryCallingCode(option.value as Country)}`}
            />
          )}
          searchPlaceholder={countrySearchPlaceholder}
          value={country}
        />
      </div>
      <PhoneNumberInput
        aria-invalid={invalid || undefined}
        defaultCountry={country}
        disabled={disabled}
        inputComponent={NumberInput}
        id={id}
        onChange={(nextValue) => {
          const nextNumber = (nextValue ?? '').startsWith(countryCode)
            ? (nextValue ?? '').slice(countryCode.length).replace(/\D/g, '')
            : (nextValue ?? '').replace(/\D/g, '');
          onValueChange({ countryCode, number: nextNumber });
        }}
        placeholder={placeholder}
        value={internationalValue}
      />
    </div>
  );
}

function CountryOption({ country, label }: { country: Country; label: string }) {
  const Flag = flags[country];

  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-muted [&_svg]:size-full">
        {Flag ? <Flag title="" /> : null}
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}

export { PhoneInput };
export type { PhoneInputProps, PhoneValue };
