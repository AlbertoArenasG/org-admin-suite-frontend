'use client';

import {
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { ClientAccessServicesContainer } from '@/components/customer-service-records-client-access';

export default function ClientAccessServicesPage() {
  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default">
        <div className="mx-auto w-full max-w-[1600px]">
          <ClientAccessServicesContainer />
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
