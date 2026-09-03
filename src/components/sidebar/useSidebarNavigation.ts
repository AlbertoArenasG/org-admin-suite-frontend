'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useAuthorization } from '@/features/auth';
import { useAppSelector } from '@/hooks/useAppSelector';

import { dashboardNavigationEntries, sidebarNavigationGroups } from './navigation/definitions';
import { resolveSidebarNavigation } from './navigation/resolve';
import type { SidebarGroupId } from './navigation/types';
import { resolveSidebarNavigationVisibility } from './navigation/visibility';

export function useSidebarNavigation() {
  const pathname = usePathname();
  const { t } = useTranslation('nav');
  const { hasModule, hasPermission } = useAuthorization();
  const user = useAppSelector((state) => state.auth.user);
  const visibility = React.useMemo(
    () =>
      resolveSidebarNavigationVisibility({
        hasModule,
        hasPermission,
        isMasterAdmin: user?.systemRole === 'MASTER_ADMIN',
      }),
    [hasModule, hasPermission, user?.systemRole]
  );
  const navigation = React.useMemo(
    () =>
      resolveSidebarNavigation(
        dashboardNavigationEntries,
        sidebarNavigationGroups,
        visibility,
        pathname,
        t
      ),
    [pathname, t, visibility]
  );
  const [selectedGroupId, setSelectedGroupId] = React.useState<SidebarGroupId>(
    navigation.activeGroupId ?? 'dashboard'
  );

  React.useEffect(() => {
    if (navigation.activeGroupId) {
      setSelectedGroupId(navigation.activeGroupId);
      return;
    }

    setSelectedGroupId((currentGroupId) => {
      if (currentGroupId === 'dashboard') {
        return currentGroupId;
      }

      return navigation.groups.some((group) => group.id === currentGroupId)
        ? currentGroupId
        : 'dashboard';
    });
  }, [navigation.activeGroupId, navigation.groups]);

  const selectedGroup = navigation.groups.find((group) => group.id === selectedGroupId) ?? null;
  const selectedEntries =
    selectedGroupId === 'dashboard' ? navigation.dashboardEntries : (selectedGroup?.entries ?? []);

  return {
    ...navigation,
    selectedEntries,
    selectedGroupId,
    setSelectedGroupId,
  };
}
