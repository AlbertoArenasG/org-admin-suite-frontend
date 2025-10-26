'use client';

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

export function NavMain({ items, label }: { items: NavItem[]; label: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items && item.items.length > 0 ? (
              <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          {subItem.items && subItem.items.length > 0 ? (
                            <Collapsible asChild className="group/nested">
                              <div>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton className="flex items-center gap-2">
                                    {subItem.icon ? <subItem.icon className="size-4" /> : null}
                                    <span>{subItem.title}</span>
                                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="pl-4">
                                    {subItem.items.map((child) => (
                                      <SidebarMenuSubItem key={child.title}>
                                        <SidebarMenuSubButton asChild isActive={child.isActive}>
                                          <Link
                                            href={child.url}
                                            className="flex w-full items-center gap-2"
                                          >
                                            {child.icon ? <child.icon className="size-4" /> : null}
                                            <span>{child.title}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                              <Link href={subItem.url} className="flex w-full items-center gap-2">
                                {subItem.icon ? <subItem.icon className="size-4" /> : null}
                                <span>{subItem.title}</span>
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
