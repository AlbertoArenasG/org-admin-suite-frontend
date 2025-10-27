'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
  hideOnDesktop?: boolean;
}

export interface PageBreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
  listClassName?: string;
}

export function PageBreadcrumbs({ segments, className, listClassName }: PageBreadcrumbsProps) {
  if (!segments.length) {
    return null;
  }

  const lastIndex = segments.length - 1;

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className={cn(listClassName)}>
        {segments.map((segment, index) => {
          const isLast = index === lastIndex;
          const itemClass = segment.hideOnDesktop ? 'hidden md:block' : undefined;

          return (
            <BreadcrumbItem key={`${segment.label}-${index}`} className={itemClass}>
              {segment.href && !isLast ? (
                <Link href={segment.href} className="hover:text-foreground transition-colors">
                  {segment.label}
                </Link>
              ) : (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              )}
              {!isLast ? (
                <span className="inline-flex">
                  <BreadcrumbSeparator
                    className={segment.hideOnDesktop ? 'hidden md:block' : undefined}
                  />
                </span>
              ) : null}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
