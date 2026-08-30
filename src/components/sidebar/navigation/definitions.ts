import {
  Archive,
  BookUser,
  CalendarClock,
  ChartColumn,
  ClockAlert,
  LayoutDashboard,
  Mail,
  PlusCircle,
  Send,
  Settings2,
  Scroll,
  ShieldCheck,
  Truck,
  Users,
  UserPlus2,
  Wrench,
} from 'lucide-react';

import type { SidebarNavigationEntryDefinition, SidebarNavigationGroupDefinition } from './types';

const startsWith = (prefix: string) => (pathname: string) => pathname.startsWith(prefix);
const isExactPath = (path: string) => (pathname: string) => pathname === path;

export const dashboardNavigationEntry: SidebarNavigationEntryDefinition = {
  id: 'dashboard',
  labelKey: 'dashboard',
  href: '/dashboard',
  icon: LayoutDashboard,
  matchesPathname: isExactPath('/dashboard'),
};

export const sidebarNavigationGroups: SidebarNavigationGroupDefinition[] = [
  {
    id: 'operation',
    labelKey: 'operation',
    icon: Wrench,
    entries: [
      {
        id: 'internalAssetControl',
        labelKey: 'internalAssetControl',
        href: '/dashboard/internal-asset-control',
        icon: CalendarClock,
        matchesPathname: startsWith('/dashboard/internal-asset-control'),
        children: [
          {
            id: 'internalAssetControlList',
            labelKey: 'internalAssetControlList',
            href: '/dashboard/internal-asset-control',
            matchesPathname: isExactPath('/dashboard/internal-asset-control'),
          },
          {
            id: 'internalAssetControlCreate',
            labelKey: 'internalAssetControlCreate',
            href: '/dashboard/internal-asset-control/new',
            icon: PlusCircle,
            matchesPathname: isExactPath('/dashboard/internal-asset-control/new'),
          },
        ],
      },
      {
        id: 'customerServiceRecords',
        labelKey: 'customerServiceRecords',
        href: '/dashboard/customer-service-records',
        icon: Scroll,
        matchesPathname: startsWith('/dashboard/customer-service-records'),
        children: [
          {
            id: 'customerServiceRecordsList',
            labelKey: 'customerServiceRecordsList',
            href: '/dashboard/customer-service-records',
            matchesPathname: isExactPath('/dashboard/customer-service-records'),
          },
          {
            id: 'customerServiceRecordsCreate',
            labelKey: 'customerServiceRecordsCreate',
            href: '/dashboard/customer-service-records/new',
            icon: PlusCircle,
            matchesPathname: isExactPath('/dashboard/customer-service-records/new'),
          },
        ],
      },
      {
        id: 'services',
        labelKey: 'services',
        href: '/dashboard/service-entries',
        icon: Wrench,
        matchesPathname: (pathname) =>
          pathname.startsWith('/dashboard/service-entries') ||
          pathname.startsWith('/dashboard/service-packages-records'),
        children: [
          {
            id: 'serviceEntries',
            labelKey: 'serviceEntries',
            href: '/dashboard/service-entries',
            icon: Scroll,
            matchesPathname: (pathname) =>
              pathname === '/dashboard/service-entries' ||
              (pathname.startsWith('/dashboard/service-entries') && !pathname.includes('/surveys')),
          },
          {
            id: 'serviceEntrySurveys',
            labelKey: 'serviceEntrySurveys',
            href: '/dashboard/service-entries/surveys',
            icon: ChartColumn,
            matchesPathname: startsWith('/dashboard/service-entries/surveys'),
          },
          {
            id: 'servicePackagesRecords',
            labelKey: 'servicePackagesRecords',
            href: '/dashboard/service-packages-records',
            icon: Archive,
            matchesPathname: startsWith('/dashboard/service-packages-records'),
          },
        ],
      },
    ],
  },
  {
    id: 'directory',
    labelKey: 'directory',
    icon: BookUser,
    entries: [
      {
        id: 'customers',
        labelKey: 'customers',
        href: '/dashboard/customers',
        icon: Users,
        matchesPathname: startsWith('/dashboard/customers'),
        children: [
          {
            id: 'customersList',
            labelKey: 'customersList',
            href: '/dashboard/customers',
            matchesPathname: isExactPath('/dashboard/customers'),
          },
          {
            id: 'customersCreate',
            labelKey: 'customersCreate',
            href: '/dashboard/customers/new',
            icon: PlusCircle,
            matchesPathname: isExactPath('/dashboard/customers/new'),
          },
        ],
      },
      {
        id: 'providers',
        labelKey: 'providers',
        href: '/dashboard/providers',
        icon: Truck,
        matchesPathname: startsWith('/dashboard/providers'),
        children: [
          {
            id: 'providersList',
            labelKey: 'providersList',
            href: '/dashboard/providers',
            matchesPathname: isExactPath('/dashboard/providers'),
          },
          {
            id: 'providersCreate',
            labelKey: 'providersCreate',
            href: '/dashboard/providers/new',
            icon: PlusCircle,
            matchesPathname: isExactPath('/dashboard/providers/new'),
          },
        ],
      },
      {
        id: 'contacts',
        labelKey: 'contacts',
        href: '/dashboard/contacts',
        icon: BookUser,
        matchesPathname: startsWith('/dashboard/contacts'),
      },
    ],
  },
  {
    id: 'communication',
    labelKey: 'communication',
    icon: Send,
    entries: [
      {
        id: 'recipientGroups',
        labelKey: 'recipientGroups',
        href: '/dashboard/recipient-groups',
        icon: Send,
        matchesPathname: startsWith('/dashboard/recipient-groups'),
      },
    ],
  },
  {
    id: 'configuration',
    labelKey: 'configuration',
    icon: Settings2,
    entries: [
      {
        id: 'expirationPolicies',
        labelKey: 'expirationPolicies',
        href: '/dashboard/expiration-status-policies',
        icon: ClockAlert,
        matchesPathname: (pathname) =>
          pathname.startsWith('/dashboard/expiration-status-policies') ||
          pathname.startsWith('/dashboard/expiration-notification-policies'),
        children: [
          {
            id: 'expirationStatusPolicies',
            labelKey: 'expirationStatusPolicies',
            href: '/dashboard/expiration-status-policies',
            matchesPathname: startsWith('/dashboard/expiration-status-policies'),
          },
          {
            id: 'expirationNotificationPolicies',
            labelKey: 'expirationNotificationPolicies',
            href: '/dashboard/expiration-notification-policies',
            matchesPathname: startsWith('/dashboard/expiration-notification-policies'),
          },
        ],
      },
    ],
  },
  {
    id: 'administration',
    labelKey: 'administration',
    icon: ShieldCheck,
    entries: [
      {
        id: 'users',
        labelKey: 'users',
        href: '/dashboard/users',
        icon: Users,
        matchesPathname: startsWith('/dashboard/users'),
        hrefChildPriority: ['usersList', 'userRegistrationInvitations', 'usersInvite'],
        children: [
          {
            id: 'usersList',
            labelKey: 'usersList',
            href: '/dashboard/users',
            matchesPathname: isExactPath('/dashboard/users'),
          },
          {
            id: 'usersInvite',
            labelKey: 'usersInvite',
            href: '/dashboard/users/invite',
            icon: UserPlus2,
            matchesPathname: isExactPath('/dashboard/users/invite'),
          },
          {
            id: 'userRegistrationInvitations',
            labelKey: 'userRegistrationInvitations',
            href: '/dashboard/users/invitations',
            icon: Mail,
            matchesPathname: isExactPath('/dashboard/users/invitations'),
          },
        ],
      },
      {
        id: 'roles',
        labelKey: 'roles',
        href: '/dashboard/roles',
        icon: ShieldCheck,
        matchesPathname: startsWith('/dashboard/roles'),
        children: [
          {
            id: 'rolesList',
            labelKey: 'rolesList',
            href: '/dashboard/roles',
            matchesPathname: isExactPath('/dashboard/roles'),
          },
          {
            id: 'rolesCreate',
            labelKey: 'rolesCreate',
            labelOptions: { defaultValue: 'Crear rol' },
            href: '/dashboard/roles/new',
            icon: PlusCircle,
            matchesPathname: isExactPath('/dashboard/roles/new'),
          },
        ],
      },
    ],
  },
];
