'use client';

import { SidebarAccountMenu } from '@/components/sidebar/SidebarAccountMenu';
import { SidebarGroupRail } from '@/components/sidebar/SidebarGroupRail';
import { SidebarNavigationPane } from '@/components/sidebar/SidebarNavigationPane';
import { SidebarPaneHeader } from '@/components/sidebar/SidebarPaneHeader';
import { SidebarRailBrand } from '@/components/sidebar/SidebarRailBrand';
import type { SidebarNavigationShellProps } from '@/components/sidebar/sidebar-shell.types';
import { SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type SidebarDesktopShellProps = SidebarNavigationShellProps & {
  collapsed: boolean;
  onToggle: () => void;
};

export function SidebarDesktopShell({
  dashboard,
  groups,
  selectedGroupId,
  selectedEntries,
  navigationTitle,
  onSelectGroup,
  user,
  logoAlt,
  collapsed,
  onToggle,
}: SidebarDesktopShellProps) {
  return (
    <div className="relative isolate flex h-full min-h-0 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="dashboard-navigation-rail pointer-events-none absolute inset-y-0 left-0 z-0 w-14 border-r"
      />
      <div className="relative z-10 flex min-h-0 flex-1">
        <aside className="flex w-14 shrink-0 flex-col items-center gap-3 px-1 py-2">
          <SidebarRailBrand collapsed={collapsed} logoAlt={logoAlt} onExpand={onToggle} />
          <SidebarGroupRail
            dashboard={dashboard}
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={onSelectGroup}
          />
        </aside>
        <div
          className={cn(
            'dashboard-navigation-pane flex min-w-0 flex-1 flex-col overflow-hidden transition-[width,opacity,transform]',
            collapsed && 'pointer-events-none w-0 flex-none translate-x-2 px-0 opacity-0'
          )}
        >
          <SidebarHeader className="shrink-0 p-2">
            <SidebarPaneHeader onCollapse={onToggle} />
          </SidebarHeader>
          <SidebarContent className="min-w-0 flex-1 overflow-x-hidden px-2 pb-4">
            <SidebarNavigationPane
              title={navigationTitle}
              entries={selectedEntries}
              className="px-1"
            />
          </SidebarContent>
          <SidebarFooter className="shrink-0 p-2">
            <SidebarAccountMenu user={user} />
          </SidebarFooter>
        </div>
      </div>
    </div>
  );
}
