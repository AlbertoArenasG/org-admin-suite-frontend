import type { SidebarNavigationAuthorization, SidebarNavigationEntryId } from './types';

export type SidebarNavigationVisibility = Record<SidebarNavigationEntryId, boolean>;

export function resolveSidebarNavigationVisibility(
  authorization: SidebarNavigationAuthorization
): SidebarNavigationVisibility {
  const canReadUsers = authorization.hasModule('USERS');
  const canInviteUsers = authorization.hasPermission('USER_REGISTRATION_INVITATIONS', 'CREATE');
  const canReadUserRegistrationInvitations = authorization.hasPermission(
    'USER_REGISTRATION_INVITATIONS',
    'READ'
  );
  const canReadRoles = authorization.hasPermission('ROLES', 'READ');
  const canReadInternalAssetControl = authorization.hasPermission(
    'INTERNAL_ASSET_MAINTENANCE_RECORDS',
    'READ'
  );
  const canCreateInternalAssetControl = authorization.hasPermission(
    'INTERNAL_ASSET_MAINTENANCE_RECORDS',
    'CREATE'
  );

  return {
    dashboard: true,
    users: true,
    usersList: canReadUsers,
    usersInvite: canInviteUsers,
    userRegistrationInvitations: canReadUserRegistrationInvitations,
    roles: canReadRoles,
    rolesList: canReadRoles,
    rolesCreate: canReadRoles && authorization.hasPermission('ROLES', 'CREATE'),
    expirationPolicies: true,
    expirationStatusPolicies: authorization.hasPermission('EXPIRATION_STATUS_POLICIES', 'READ'),
    expirationNotificationPolicies: authorization.hasPermission(
      'EXPIRATION_NOTIFICATION_POLICIES',
      'READ'
    ),
    internalAssetControl: canReadInternalAssetControl || canCreateInternalAssetControl,
    internalAssetControlList: canReadInternalAssetControl,
    internalAssetControlCreate: canCreateInternalAssetControl,
    contacts: authorization.hasPermission('CONTACTS', 'READ'),
    recipientGroups: authorization.hasPermission('RECIPIENT_GROUPS', 'READ'),
    customers: authorization.hasModule('CUSTOMERS'),
    customersList: authorization.hasModule('CUSTOMERS'),
    customersCreate:
      authorization.hasModule('CUSTOMERS') && authorization.hasPermission('CUSTOMERS', 'CREATE'),
    providers: authorization.hasModule('PROVIDERS'),
    providersList: authorization.hasModule('PROVIDERS'),
    providersCreate:
      authorization.hasModule('PROVIDERS') && authorization.hasPermission('PROVIDERS', 'CREATE'),
    services: true,
    serviceEntries: authorization.hasModule('SERVICE_ENTRIES'),
    serviceEntrySurveys: authorization.hasModule('SERVICE_ENTRY_SURVEYS'),
    servicePackagesRecords: authorization.hasModule('SERVICE_PACKAGES'),
  };
}
