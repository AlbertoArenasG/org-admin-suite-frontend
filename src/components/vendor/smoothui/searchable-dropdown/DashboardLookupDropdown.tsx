'use client';

import { cn } from '@/lib/utils';

import SearchableDropdown, {
  type SearchableDropdownItem,
  type SearchableDropdownProps,
} from './SearchableDropdown';

export type DashboardLookupDropdownItem = SearchableDropdownItem;

export type DashboardLookupDropdownProps = Omit<SearchableDropdownProps, 'className' | 'label'> & {
  className?: string;
  label?: string;
};

/** Product entry point that scopes SmoothUI's lookup to the dashboard contract. */
export function DashboardLookupDropdown({
  className,
  label = 'Seleccionar una opción',
  ...props
}: DashboardLookupDropdownProps) {
  return (
    <SearchableDropdown
      {...props}
      className={cn('dashboard-lookup-dropdown', className)}
      label={label}
    />
  );
}
