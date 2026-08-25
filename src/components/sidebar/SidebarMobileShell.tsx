'use client';

import { SidebarAccountMenu } from '@/components/sidebar/SidebarAccountMenu';
import { SidebarBrand } from '@/components/sidebar/SidebarBrand';
import { SidebarGroupRail } from '@/components/sidebar/SidebarGroupRail';
import { SidebarNavigationPane } from '@/components/sidebar/SidebarNavigationPane';
import type { SidebarNavigationShellProps } from '@/components/sidebar/sidebar-shell.types';
import { SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

type SidebarMobileShellProps = SidebarNavigationShellProps & {
  onClose: () => void;
};

export function SidebarMobileShell({
  dashboard,
  groups,
  selectedGroupId,
  selectedEntries,
  navigationTitle,
  onSelectGroup,
  user,
  logoAlt,
  onClose,
}: SidebarMobileShellProps) {
  return (
    <>
      <SidebarHeader className="p-2">
        <SidebarBrand
          collapsed={false}
          mobile
          logoAlt={logoAlt}
          onToggle={onClose}
          onNavigate={onClose}
        />
      </SidebarHeader>
      <SidebarContent className="min-w-0 flex-1 overflow-x-hidden px-2 pb-4">
        <div className="mb-4 border-b border-white/10 px-2 pb-3">
          <SidebarGroupRail
            dashboard={dashboard}
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={onSelectGroup}
            orientation="horizontal"
          />
        </div>
        <SidebarNavigationPane
          title={navigationTitle}
          entries={selectedEntries}
          onNavigate={onClose}
          className="px-1"
        />
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarAccountMenu user={user} onNavigate={onClose} />
      </SidebarFooter>
    </>
  );
}
