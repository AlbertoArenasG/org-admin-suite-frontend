import Chip from '@mui/material/Chip';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { CustomerRelationshipSummary } from '@/features/customers';

interface RelatedCustomersSectionProps {
  customers?: CustomerRelationshipSummary[];
}

export function RelatedCustomersSection({ customers = [] }: RelatedCustomersSectionProps) {
  const { t } = useTranslation('users');

  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center gap-2">
        <Building2 className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">{t('relatedCustomers.title')}</h2>
      </div>
      {customers.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t('relatedCustomers.empty')}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {customers.map((customer) => (
            <Chip
              key={customer.id}
              label={`${customer.companyName} · ${customer.statusName}`}
              size="small"
              variant="outlined"
            />
          ))}
        </div>
      )}
    </section>
  );
}
