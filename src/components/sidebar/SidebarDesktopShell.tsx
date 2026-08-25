'use client';

import { SidebarAccountMenu } from '@/components/sidebar/SidebarAccountMenu';
import { SidebarBrand } from '@/components/sidebar/SidebarBrand';
import { SidebarGroupRail } from '@/components/sidebar/SidebarGroupRail';
import { SidebarNavigationPane } from '@/components/sidebar/SidebarNavigationPane';
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
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-14 border-r border-white/10 bg-gradient-to-b from-[var(--sidebar-gradient-from)] via-[var(--sidebar-gradient-via)] to-[var(--sidebar-gradient-to)]"
      />
      <SidebarHeader className="relative z-10 p-2">
        <SidebarBrand collapsed={collapsed} logoAlt={logoAlt} onToggle={onToggle} />
      </SidebarHeader>
      <div className="relative z-10 flex min-h-0 flex-1">
        <aside className="flex w-14 shrink-0 flex-col items-center px-1 pt-1">
          <SidebarGroupRail
            dashboard={dashboard}
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={onSelectGroup}
          />
        </aside>
        <SidebarContent
          className={cn(
            'min-w-0 flex-1 overflow-x-hidden px-2 pb-4 transition-[width,opacity,transform] duration-200 ease-out motion-reduce:transition-none',
            collapsed && 'pointer-events-none w-0 flex-none translate-x-2 px-0 opacity-0'
          )}
        >
          <SidebarNavigationPane
            title={navigationTitle}
            entries={selectedEntries}
            className="px-1"
          />
        </SidebarContent>
      </div>
      <SidebarFooter className="relative z-10 p-2">
        <SidebarAccountMenu user={user} collapsed={collapsed} />
      </SidebarFooter>
    </div>
  );
}
