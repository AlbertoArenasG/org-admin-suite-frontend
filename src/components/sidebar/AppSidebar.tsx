'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/NavMain';
import { NavProjects } from '@/components/sidebar/NavProjects';
import { NavUser } from '@/components/sidebar/NavUser';
import { TeamSwitcher } from '@/components/sidebar/TeamSwitcher';
import SelectLang from '@/components/shared/LangToggle';
import { ModeToggle } from '@/components/shared/ModeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks/useAppSelector';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const authUser = useAppSelector((state) => state.auth.user);

  const sidebarUser = React.useMemo(() => {
    if (!authUser) {
      return data.user;
    }

    const fullName = [authUser.name, authUser.lastname].filter(Boolean).join(' ').trim();

    return {
      name: fullName || authUser.email,
      email: authUser.email,
      avatar: '',
    };
  }, [authUser]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'border-none [&_[data-slot=sidebar-gap]]:bg-transparent',
        '[&_[data-slot=sidebar-inner]]:border [&_[data-slot=sidebar-inner]]:border-sidebar-border [&_[data-slot=sidebar-inner]]:bg-gradient-to-b [&_[data-slot=sidebar-inner]]:from-[var(--sidebar-gradient-from)] [&_[data-slot=sidebar-inner]]:via-[var(--sidebar-gradient-via)] [&_[data-slot=sidebar-inner]]:to-[var(--sidebar-gradient-to)] [&_[data-slot=sidebar-inner]]:text-sidebar-foreground [&_[data-slot=sidebar-inner]]:shadow-[0_20px_45px_rgba(14,4,46,0.45)]',
        '[&_[data-slot=sidebar-header]]:px-4 [&_[data-slot=sidebar-header]]:pt-6 [&_[data-slot=sidebar-header]]:pb-4',
        '[&_[data-slot=sidebar-content]]:px-2',
        '[&_[data-slot=sidebar-footer]]:px-4 [&_[data-slot=sidebar-footer]]:pb-6',
        className
      )}
      {...props}
    >
      <SidebarHeader>
        <NavUser user={sidebarUser} />
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="gap-3">
        <div className="flex flex-col items-stretch gap-3 rounded-xl p-2 backdrop-blur-sm group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-2">
          <ModeToggle
            buttonVariant="ghost"
            buttonSize="icon"
            buttonClassName="size-10 rounded-xl border-none bg-white/15 text-sidebar-foreground hover:bg-white/40 group-data-[collapsible=icon]:size-9"
          />
          <SelectLang
            buttonVariant="ghost"
            buttonSize="icon"
            buttonClassName="size-10 rounded-xl border-none bg-white/15 text-sidebar-foreground hover:bg-white/40 group-data-[collapsible=icon]:size-9"
          />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
