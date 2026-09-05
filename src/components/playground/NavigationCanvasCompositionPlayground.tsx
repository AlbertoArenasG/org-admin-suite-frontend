'use client';

import { useState } from 'react';
import {
  NavigationExperimentSidebar,
  type NavigationExperimentGroupId,
} from '@/components/playground/navigation-composition/NavigationExperimentSidebar';
import { NavigationExperimentCanvas } from '@/components/playground/navigation-composition/NavigationExperimentCanvas';

/**
 * Desktop-first visual study. It owns its layout so the real navigation and
 * dashboard shell remain untouched while the composition is reviewed.
 */
export function NavigationCanvasCompositionPlayground() {
  const [activeGroup, setActiveGroup] = useState<NavigationExperimentGroupId>('panel');
  const [activeEntry, setActiveEntry] = useState('overview');

  return (
    <main className="dashboard-shell min-h-svh overflow-hidden text-foreground md:h-svh">
      <div className="flex min-h-svh flex-col overflow-hidden md:h-svh md:flex-row">
        <NavigationExperimentSidebar
          activeGroup={activeGroup}
          activeEntry={activeEntry}
          onGroupChange={setActiveGroup}
          onEntryChange={setActiveEntry}
        />
        <div className="dashboard-content-inset flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <NavigationExperimentCanvas />
        </div>
      </div>
    </main>
  );
}
