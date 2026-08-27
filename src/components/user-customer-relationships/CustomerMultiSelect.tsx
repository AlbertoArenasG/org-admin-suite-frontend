'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { MultiSelect } from '@/components/ui/combobox';
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
  const activeOptions = options.filter((customer) => !inactiveIds.has(customer.id));
  const activeValues = value.filter((customerId) => !inactiveIds.has(customerId));
  const selectedCustomers = activeOptions.filter((customer) => activeValues.includes(customer.id));

  const handleActiveValuesChange = (customerIds: string[]) => {
    onChange([...inactiveIds, ...customerIds]);
  };

  return (
    <div className="grid gap-2">
      <MultiSelect
        options={activeOptions.map((customer) => ({
          value: customer.id,
          label: customer.companyName,
        }))}
        values={activeValues}
        onValuesChange={handleActiveValuesChange}
        loading={loading}
        disabled={disabled}
        placeholder={t('form.placeholders.customers')}
        searchPlaceholder={t('form.placeholders.customers')}
        emptyMessage={t('form.customers.noOptions')}
        loadingMessage={t('form.customers.loading')}
        selectedSummary={t('form.customers.addAnother')}
      />
      {selectedCustomers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedCustomers.map((customer) => (
            <span
              key={customer.id}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary/25 bg-primary/10 py-1 pl-2.5 pr-1 text-xs text-foreground"
            >
              <span className="truncate">{customer.companyName}</span>
              <button
                type="button"
                aria-label={t('form.customers.remove', { customer: customer.companyName })}
                disabled={disabled}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-foreground disabled:pointer-events-none"
                onClick={() =>
                  handleActiveValuesChange(
                    activeValues.filter((customerId) => customerId !== customer.id)
                  )
                }
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      {inactiveCustomers.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {inactiveCustomers.map((customer) => (
            <span
              key={customer.id}
              className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {customer.companyName} · {customer.statusName}
            </span>
          ))}
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
