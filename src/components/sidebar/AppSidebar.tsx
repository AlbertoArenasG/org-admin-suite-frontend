'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarAccountMenu } from '@/components/sidebar/SidebarAccountMenu';
import { SidebarBrand } from '@/components/sidebar/SidebarBrand';
import { SidebarGroupRail } from '@/components/sidebar/SidebarGroupRail';
import { SidebarNavigationPane } from '@/components/sidebar/SidebarNavigationPane';
import { useSidebarNavigation } from '@/components/sidebar/useSidebarNavigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
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

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'border-none [&_[data-slot=sidebar-gap]]:bg-transparent',
        '[&_[data-slot=sidebar-inner]]:border [&_[data-slot=sidebar-inner]]:border-sidebar-border [&_[data-slot=sidebar-inner]]:bg-gradient-to-b [&_[data-slot=sidebar-inner]]:from-[var(--sidebar-gradient-from)] [&_[data-slot=sidebar-inner]]:via-[var(--sidebar-gradient-via)] [&_[data-slot=sidebar-inner]]:to-[var(--sidebar-gradient-to)] [&_[data-slot=sidebar-inner]]:text-sidebar-foreground [&_[data-slot=sidebar-inner]]:shadow-[0_20px_45px_rgba(14,4,46,0.45)]',
        className
      )}
      {...props}
    >
      <SidebarHeader className="p-4 pb-3">
        <SidebarBrand
          collapsed={collapsed}
          mobile={isMobile}
          logoAlt={t('logoAlt', { defaultValue: 'Company logo' })}
          onToggle={isMobile ? closeMobileNavigation : toggleSidebar}
          onNavigate={closeMobileNavigation}
        />
      </SidebarHeader>
      <div className="flex min-h-0 flex-1">
        {!isMobile ? (
          <aside className="flex w-16 shrink-0 flex-col items-center border-r border-white/10 px-2 pt-1">
            <SidebarGroupRail
              dashboard={dashboard}
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
            />
          </aside>
        ) : null}
        <SidebarContent
          className={cn(
            'min-w-0 flex-1 overflow-x-hidden px-2 pb-4 transition-[width,opacity,transform] duration-200 ease-out motion-reduce:transition-none',
            collapsed && 'w-0 flex-none translate-x-2 px-0 opacity-0 pointer-events-none'
          )}
        >
          {isMobile ? (
            <div className="mb-4 border-b border-white/10 px-2 pb-3">
              <SidebarGroupRail
                dashboard={dashboard}
                groups={groups}
                selectedGroupId={selectedGroupId}
                onSelectGroup={setSelectedGroupId}
                orientation="horizontal"
              />
            </div>
          ) : null}
          <SidebarNavigationPane
            title={navigationTitle}
            entries={selectedEntries}
            onNavigate={closeMobileNavigation}
            className="px-1"
          />
        </SidebarContent>
      </div>
      <SidebarFooter className="p-3 pt-2">
        <SidebarAccountMenu
          user={sidebarUser}
          collapsed={collapsed}
          onNavigate={closeMobileNavigation}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
