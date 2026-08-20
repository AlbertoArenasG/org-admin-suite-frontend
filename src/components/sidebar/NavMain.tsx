'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

type NavMainProps = {
  items: NavItem[];
  label: string;
  openItemTitle?: string;
  onOpenItemTitleChange?: (title: string | undefined) => void;
};

export function NavMain({
  items,
  label,
  openItemTitle: controlledOpenItemTitle,
  onOpenItemTitleChange,
}: NavMainProps) {
  const activeItemTitle = items.find((item) => item.isActive && item.items?.length)?.title;
  const [uncontrolledOpenItemTitle, setUncontrolledOpenItemTitle] = React.useState<
    string | undefined
  >(activeItemTitle);
  const isControlled = onOpenItemTitleChange !== undefined;
  const openItemTitle = isControlled ? controlledOpenItemTitle : uncontrolledOpenItemTitle;

  React.useEffect(() => {
    if (!isControlled) {
      setUncontrolledOpenItemTitle(activeItemTitle);
    }
  }, [activeItemTitle, isControlled]);

  const handleOpenItemChange = (title: string, isOpen: boolean) => {
    const nextTitle = isOpen ? title : undefined;

    if (isControlled) {
      onOpenItemTitleChange(nextTitle);
      return;
    }

    setUncontrolledOpenItemTitle(nextTitle);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items && item.items.length > 0 ? (
              <Collapsible
                asChild
                open={openItemTitle === item.title}
                onOpenChange={(isOpen) => handleOpenItemChange(item.title, isOpen)}
                className="group/collapsible"
              >
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.isActive}
                      className="h-auto min-h-8 items-start py-1.5 [&>span]:min-w-0 [&>span]:whitespace-normal [&>span]:leading-4"
                    >
                      {item.icon && <item.icon />}
                      <span className="min-w-0 !overflow-visible !text-clip !whitespace-normal leading-4">
                        {item.title}
                      </span>
                      <ChevronRight className="mt-0.5 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="sidebar-nav-collapsible-content">
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          {subItem.items && subItem.items.length > 0 ? (
                            <Collapsible asChild className="group/nested">
                              <div>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton className="h-auto min-h-7 items-start py-1.5 [&>span]:min-w-0 [&>span]:whitespace-normal [&>span]:leading-4">
                                    {subItem.icon ? <subItem.icon className="size-4" /> : null}
                                    <span className="min-w-0 !overflow-visible !text-clip !whitespace-normal leading-4">
                                      {subItem.title}
                                    </span>
                                    <ChevronRight className="mt-0.5 ml-auto size-4 transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="pl-4">
                                    {subItem.items.map((child) => (
                                      <SidebarMenuSubItem key={child.title}>
                                        <SidebarMenuSubButton
                                          asChild
                                          isActive={child.isActive}
                                          className="h-auto min-h-7 items-start py-1.5 [&>span]:min-w-0 [&>span]:whitespace-normal [&>span]:leading-4"
                                        >
                                          <Link
                                            href={child.url}
                                            className="flex w-full items-start gap-2"
                                          >
                                            {child.icon ? <child.icon className="size-4" /> : null}
                                            <span className="min-w-0 !overflow-visible !text-clip !whitespace-normal leading-4">
                                              {child.title}
                                            </span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive}
                              className="h-auto min-h-7 items-start py-1.5 [&>span]:min-w-0 [&>span]:whitespace-normal [&>span]:leading-4"
                            >
                              <Link href={subItem.url} className="flex w-full items-start gap-2">
                                {subItem.icon ? <subItem.icon className="size-4" /> : null}
                                <span className="min-w-0 !overflow-visible !text-clip !whitespace-normal leading-4">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <Link href={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
