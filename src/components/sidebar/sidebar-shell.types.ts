import type {
  ResolvedSidebarNavigation,
  ResolvedSidebarNavigationEntry,
  SidebarGroupId,
} from '@/components/sidebar/navigation/types';

export type SidebarUser = {
  name: string;
  email: string;
  avatar?: string | null;
};

export type SidebarNavigationShellProps = {
  dashboard: ResolvedSidebarNavigation['dashboard'];
  groups: ResolvedSidebarNavigation['groups'];
  selectedGroupId: SidebarGroupId;
  selectedEntries: ResolvedSidebarNavigationEntry[];
  navigationTitle: string;
  onSelectGroup: (groupId: SidebarGroupId) => void;
  user: SidebarUser;
  logoAlt: string;
};
