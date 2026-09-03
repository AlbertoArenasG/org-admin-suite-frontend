'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarDesktopShell } from '@/components/sidebar/SidebarDesktopShell';
import { SidebarMobileShell } from '@/components/sidebar/SidebarMobileShell';
import { useSidebarNavigation } from '@/components/sidebar/useSidebarNavigation';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { useAppSelector } from '@/hooks/useAppSelector';
import { cn } from '@/lib/utils';

const fallbackUser = {
  name: 'ICSA',
  email: '',
  avatar: '',
};

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation('publicCustomerProfile');
  const authUser = useAppSelector((state) => state.auth.user);
  const { isMobile, setOpenMobile, state, toggleSidebar } = useSidebar();
  const { dashboard, groups, selectedEntries, selectedGroupId, setSelectedGroupId } =
    useSidebarNavigation();
  const collapsed = !isMobile && state === 'collapsed';
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const navigationTitle =
    selectedGroupId === 'dashboard' ? dashboard.title : (selectedGroup?.title ?? dashboard.title);

  const sidebarUser = React.useMemo(() => {
    if (!authUser) {
      return fallbackUser;
    }

    const fullName = [authUser.name, authUser.lastname].filter(Boolean).join(' ').trim();

    return {
      name: fullName || authUser.email,
      email: authUser.email,
      avatar: '',
    };
  }, [authUser]);

  const closeMobileNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSelectGroup = (groupId: typeof selectedGroupId) => {
    setSelectedGroupId(groupId);

    if (!isMobile && collapsed) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'dashboard-navigation-shell border-none [&_[data-slot=sidebar-gap]]:bg-transparent',
        '[&_[data-slot=sidebar-inner]]:border [&_[data-slot=sidebar-inner]]:text-sidebar-foreground',
        className
      )}
      {...props}
    >
      {isMobile ? (
        <SidebarMobileShell
          dashboard={dashboard}
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedEntries={selectedEntries}
          navigationTitle={navigationTitle}
          onSelectGroup={handleSelectGroup}
          user={sidebarUser}
          logoAlt={t('logoAlt', { defaultValue: 'Company logo' })}
          onClose={closeMobileNavigation}
        />
      ) : (
        <SidebarDesktopShell
          dashboard={dashboard}
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedEntries={selectedEntries}
          navigationTitle={navigationTitle}
          onSelectGroup={handleSelectGroup}
          user={sidebarUser}
          logoAlt={t('logoAlt', { defaultValue: 'Company logo' })}
          collapsed={collapsed}
          onToggle={toggleSidebar}
        />
      )}
    </Sidebar>
  );
}
