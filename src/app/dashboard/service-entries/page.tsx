'use client';

import { ServiceEntriesTableContainer } from '@/components/serviceEntries/ServiceEntriesTableContainer';

export default function ServiceEntriesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <ServiceEntriesTableContainer />
    </div>
  );
}
