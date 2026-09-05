'use client';

import { PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarPaneHeaderProps {
  onCollapse: () => void;
}

export function SidebarPaneHeader({ onCollapse }: SidebarPaneHeaderProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 px-3">
      <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
        Implementos Científicos
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Colapsar navegación"
        onClick={onCollapse}
        className="shrink-0 text-sidebar-foreground/70 hover:bg-[var(--dashboard-navigation-control-hover-surface)] hover:text-sidebar-foreground"
      >
        <PanelLeftClose className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
