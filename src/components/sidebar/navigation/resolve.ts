import type { TFunction } from 'i18next';

import type {
  ResolvedSidebarNavigation,
  ResolvedSidebarNavigationEntry,
  ResolvedSidebarNavigationGroup,
  SidebarNavigationEntryDefinition,
  SidebarNavigationGroupDefinition,
} from './types';
import type { SidebarNavigationVisibility } from './visibility';

function resolveEntry(
  definition: SidebarNavigationEntryDefinition,
  visibility: SidebarNavigationVisibility,
  pathname: string,
  t: TFunction
): ResolvedSidebarNavigationEntry | null {
  if (!visibility[definition.id]) {
    return null;
  }

  const children = (definition.children ?? [])
    .map((child) => resolveEntry(child, visibility, pathname, t))
    .filter((child): child is ResolvedSidebarNavigationEntry => child !== null);

  if (definition.children && children.length === 0) {
    return null;
  }

  const preferredChild = definition.hrefChildPriority
    ?.map((childId) => children.find((child) => child.id === childId))
    .find((child): child is ResolvedSidebarNavigationEntry => child !== undefined);

  return {
    id: definition.id,
    title: t(definition.labelKey, definition.labelOptions),
    href: preferredChild?.href ?? children[0]?.href ?? definition.href,
    icon: definition.icon,
    isActive: definition.matchesPathname(pathname) || children.some((child) => child.isActive),
    children,
  };
}

function resolveGroup(
  definition: SidebarNavigationGroupDefinition,
  visibility: SidebarNavigationVisibility,
  pathname: string,
  t: TFunction
): ResolvedSidebarNavigationGroup | null {
  const entries = definition.entries
    .map((entry) => resolveEntry(entry, visibility, pathname, t))
    .filter((entry): entry is ResolvedSidebarNavigationEntry => entry !== null);

  if (entries.length === 0) {
    return null;
  }

  return {
    id: definition.id,
    title: t(definition.labelKey),
    icon: definition.icon,
    entries,
    isActive: entries.some((entry) => entry.isActive),
  };
}

export function resolveSidebarNavigation(
  dashboardDefinitions: SidebarNavigationEntryDefinition[],
  groupDefinitions: SidebarNavigationGroupDefinition[],
  visibility: SidebarNavigationVisibility,
  pathname: string,
  t: TFunction
): ResolvedSidebarNavigation {
  const dashboardEntries = dashboardDefinitions
    .map((definition) => resolveEntry(definition, visibility, pathname, t))
    .filter((entry): entry is ResolvedSidebarNavigationEntry => entry !== null);
  const dashboard = dashboardEntries.find((entry) => entry.id === 'dashboard');

  if (!dashboard) {
    throw new Error('Dashboard navigation entry must always be visible.');
  }

  const groups = groupDefinitions
    .map((group) => resolveGroup(group, visibility, pathname, t))
    .filter((group): group is ResolvedSidebarNavigationGroup => group !== null);
  const activeGroup = groups.find((group) => group.isActive);

  return {
    dashboard,
    dashboardEntries,
    groups,
    activeGroupId: dashboardEntries.some((entry) => entry.isActive)
      ? 'dashboard'
      : (activeGroup?.id ?? null),
  };
}
