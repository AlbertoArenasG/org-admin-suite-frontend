import type { LucideIcon } from 'lucide-react';

export type SidebarGroupId =
  | 'dashboard'
  | 'operation'
  | 'directory'
  | 'communication'
  | 'configuration'
  | 'administration';

export type SidebarNavigationEntryId =
  | 'dashboard'
  | 'users'
  | 'usersList'
  | 'usersInvite'
  | 'userRegistrationInvitations'
  | 'roles'
  | 'rolesList'
  | 'rolesCreate'
  | 'expirationPolicies'
  | 'expirationStatusPolicies'
  | 'expirationNotificationPolicies'
  | 'internalAssetControl'
  | 'internalAssetControlList'
  | 'internalAssetControlCreate'
  | 'customerServiceRecords'
  | 'customerServiceRecordsList'
  | 'customerServiceRecordsCreate'
  | 'contacts'
  | 'recipientGroups'
  | 'customers'
  | 'customersList'
  | 'customersCreate'
  | 'providers'
  | 'providersList'
  | 'providersCreate'
  | 'services'
  | 'serviceEntries'
  | 'serviceEntrySurveys'
  | 'servicePackagesRecords';

export interface SidebarNavigationAuthorization {
  hasModule: (module: string) => boolean;
  hasPermission: (module: string, operation: string) => boolean;
}

export interface SidebarNavigationEntryDefinition {
  id: SidebarNavigationEntryId;
  labelKey: string;
  labelOptions?: Record<string, unknown>;
  href: string;
  icon?: LucideIcon;
  matchesPathname: (pathname: string) => boolean;
  children?: SidebarNavigationEntryDefinition[];
  hrefChildPriority?: SidebarNavigationEntryId[];
}

export interface SidebarNavigationGroupDefinition {
  id: Exclude<SidebarGroupId, 'dashboard'>;
  labelKey: string;
  icon: LucideIcon;
  entries: SidebarNavigationEntryDefinition[];
}

export interface ResolvedSidebarNavigationEntry {
  id: SidebarNavigationEntryId;
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive: boolean;
  children: ResolvedSidebarNavigationEntry[];
}

export interface ResolvedSidebarNavigationGroup {
  id: Exclude<SidebarGroupId, 'dashboard'>;
  title: string;
  icon: LucideIcon;
  entries: ResolvedSidebarNavigationEntry[];
  isActive: boolean;
}

export interface ResolvedSidebarNavigation {
  dashboard: ResolvedSidebarNavigationEntry;
  groups: ResolvedSidebarNavigationGroup[];
  activeGroupId: SidebarGroupId | null;
}
