'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

import type { CustomerOption, CustomerRelationshipSummary } from '@/features/customers';

interface CustomerMultiSelectProps {
  value: string[];
  onChange: (customerIds: string[]) => void;
  options: CustomerOption[];
  inactiveCustomers?: CustomerRelationshipSummary[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export function CustomerMultiSelect({
  value,
  onChange,
  options,
  inactiveCustomers = [],
  loading = false,
  error = null,
  disabled = false,
}: CustomerMultiSelectProps) {
  const { t } = useTranslation('users');
  const inactiveIds = new Set(inactiveCustomers.map((customer) => customer.id));
  const selectedOptions = options.filter(
    (customer) => value.includes(customer.id) && !inactiveIds.has(customer.id)
  );

  return (
    <div className="grid gap-2">
      <Autocomplete
        multiple
        options={options.filter((customer) => !inactiveIds.has(customer.id))}
        value={selectedOptions}
        loading={loading}
        disabled={disabled}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        getOptionLabel={(option) => option.companyName}
        noOptionsText={t('form.customers.noOptions')}
        loadingText={t('form.customers.loading')}
        onChange={(_, selectedCustomers) => {
          onChange([...inactiveIds, ...selectedCustomers.map((customer) => customer.id)]);
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={t('form.placeholders.customers')} size="small" />
        )}
        renderTags={(selectedCustomers, getTagProps) =>
          selectedCustomers.map((customer, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip key={key} label={customer.companyName} size="small" {...tagProps} />;
          })
        }
      />
      {inactiveCustomers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {inactiveCustomers.map((customer) => (
            <Chip
              key={customer.id}
              label={`${customer.companyName} · ${customer.statusName}`}
              size="small"
              variant="outlined"
              disabled
            />
          ))}
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
