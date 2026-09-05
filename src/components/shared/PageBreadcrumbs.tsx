'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  tone?: 'default' | 'workspace';
}

const MAX_VISIBLE_SEGMENTS = 3;
const MAX_VISIBLE_LABEL_LENGTH = 64;
const rootLinkClassName =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--secondary-50)] hover:text-[var(--secondary-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary-600)]';
const linkClassName =
  'inline-flex items-center rounded-md px-1 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-[var(--secondary-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary-600)]';
const currentPageClassName =
  'relative px-1 py-1 text-[13px] font-semibold text-foreground after:absolute after:-bottom-0.5 after:right-1 after:left-1 after:h-0.5 after:rounded-full after:bg-[var(--secondary-500)]';

function getBreadcrumbClassNames(tone: NonNullable<PageBreadcrumbsProps['tone']>) {
  if (tone === 'workspace') {
    return {
      rootLink:
        'dashboard-workspace-breadcrumb-control inline-flex size-8 items-center justify-center rounded-md text-[var(--workspace-chrome-breadcrumb-foreground)] hover:bg-[var(--workspace-chrome-breadcrumb-hover-surface)] hover:text-[var(--workspace-chrome-breadcrumb-hover-foreground)]',
      link: 'dashboard-workspace-breadcrumb-control inline-flex items-center rounded-md px-1 py-1 text-[13px] font-medium text-[var(--workspace-chrome-breadcrumb-foreground)] hover:text-[var(--workspace-chrome-breadcrumb-hover-foreground)]',
      current:
        'relative px-1 py-1 text-[13px] font-semibold text-[var(--workspace-chrome-breadcrumb-current-foreground)] after:absolute after:-bottom-0.5 after:right-1 after:left-1 after:h-0.5 after:rounded-full after:bg-[var(--workspace-chrome-breadcrumb-current-indicator)]',
      trigger:
        'dashboard-workspace-breadcrumb-control flex size-8 items-center justify-center rounded-md text-[var(--workspace-chrome-breadcrumb-foreground)] hover:bg-[var(--workspace-chrome-breadcrumb-hover-surface)] hover:text-[var(--workspace-chrome-breadcrumb-hover-foreground)]',
      separator: 'mx-0 text-[var(--workspace-chrome-breadcrumb-separator)] [&>svg]:size-3.5',
    };
  }

  return {
    rootLink: rootLinkClassName,
    link: linkClassName,
    current: currentPageClassName,
    trigger:
      'flex size-8 items-center justify-center rounded-md text-muted-foreground outline-hidden transition-colors hover:bg-[var(--secondary-50)] hover:text-[var(--secondary-700)] focus-visible:ring-2 focus-visible:ring-[var(--secondary-600)]',
    separator: 'mx-0 text-muted-foreground/45 [&>svg]:size-3.5',
  };
}

function MobileBreadcrumbs({
  segments,
  className,
  listClassName,
  tone = 'default',
}: PageBreadcrumbsProps) {
  const firstSegment = segments[0];
  const currentSegment = segments.at(-1)!;
  const hiddenSegments = segments.slice(1, -1);
  const isRootRoute = segments.length === 1;
  const breadcrumbClassNames = getBreadcrumbClassNames(tone);

  return (
    <Breadcrumb className={cn('min-w-0 flex-1 md:hidden', className)}>
      <BreadcrumbList className={cn('h-9 min-w-0 flex-nowrap gap-1.5 text-[13px]', listClassName)}>
        <BreadcrumbItem className="shrink-0">
          {firstSegment.href && !isRootRoute ? (
            <BreadcrumbLink asChild>
              <Link
                href={firstSegment.href}
                aria-label={firstSegment.label}
                className={breadcrumbClassNames.rootLink}
              >
                <Home className="size-4" aria-hidden="true" />
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage
              className={cn(breadcrumbClassNames.current, 'inline-flex items-center gap-2')}
            >
              <Home className="size-4" aria-hidden="true" />
              {firstSegment.label}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {!isRootRoute ? <BreadcrumbSeparator className={breadcrumbClassNames.separator} /> : null}

        {hiddenSegments.length > 0 ? (
          <>
            <BreadcrumbItem className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={breadcrumbClassNames.trigger}
                  aria-label="Mostrar niveles intermedios"
                >
                  <BreadcrumbEllipsis className="size-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-48">
                  {hiddenSegments.map((segment, index) => (
                    <DropdownMenuItem
                      key={`${segment.label}-${index}`}
                      asChild={Boolean(segment.href)}
                    >
                      {segment.href ? (
                        <Link href={segment.href}>{segment.label}</Link>
                      ) : (
                        <span>{segment.label}</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator className={breadcrumbClassNames.separator} />
          </>
        ) : null}

        {!isRootRoute ? (
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className={cn(breadcrumbClassNames.current, 'block min-w-0')}>
              <span className="block truncate whitespace-nowrap">{currentSegment.label}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function PageBreadcrumbs({
  segments,
  className,
  listClassName,
  tone = 'default',
}: PageBreadcrumbsProps) {
  if (!segments.length) {
    return null;
  }

  const lastIndex = segments.length - 1;
  const firstSegment = segments[0];
  const currentSegment = segments.at(-1)!;
  const hiddenSegments = segments.slice(1, -1);
  const totalLabelLength = segments.reduce((total, segment) => total + segment.label.length, 0);
  const shouldCollapse =
    segments.length > MAX_VISIBLE_SEGMENTS || totalLabelLength > MAX_VISIBLE_LABEL_LENGTH;
  const breadcrumbClassNames = getBreadcrumbClassNames(tone);

  if (shouldCollapse) {
    return (
      <>
        <MobileBreadcrumbs
          segments={segments}
          className={className}
          listClassName={listClassName}
          tone={tone}
        />
        <Breadcrumb className={cn('hidden min-w-0 md:block', className)}>
          <BreadcrumbList
            className={cn('h-9 flex-nowrap gap-1.5 text-[13px] sm:gap-2', listClassName)}
          >
            <BreadcrumbItem className={firstSegment.hideOnDesktop ? 'hidden md:block' : undefined}>
              {firstSegment.href && segments.length > 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={firstSegment.href}
                    aria-label={firstSegment.label}
                    className={breadcrumbClassNames.rootLink}
                  >
                    <Home className="size-4" aria-hidden="true" />
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage
                  className={cn(breadcrumbClassNames.current, 'inline-flex items-center gap-2')}
                >
                  <Home className="size-4" aria-hidden="true" />
                  {firstSegment.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {hiddenSegments.length > 0 ? (
              <>
                <BreadcrumbSeparator
                  className={cn(
                    breadcrumbClassNames.separator,
                    firstSegment.hideOnDesktop && 'hidden md:flex'
                  )}
                />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={breadcrumbClassNames.trigger}
                      aria-label="Mostrar niveles intermedios"
                    >
                      <BreadcrumbEllipsis className="size-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48">
                      {hiddenSegments.map((segment, index) => (
                        <DropdownMenuItem
                          key={`${segment.label}-${index}`}
                          asChild={Boolean(segment.href)}
                        >
                          {segment.href ? (
                            <Link href={segment.href}>{segment.label}</Link>
                          ) : (
                            <span>{segment.label}</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            ) : null}

            {segments.length > 1 ? (
              <BreadcrumbSeparator className={breadcrumbClassNames.separator} />
            ) : null}
            {segments.length > 1 ? (
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className={cn(breadcrumbClassNames.current, 'block min-w-0')}>
                  <span className="block truncate whitespace-nowrap">{currentSegment.label}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </>
    );
  }

  return (
    <>
      <MobileBreadcrumbs
        segments={segments}
        className={className}
        listClassName={listClassName}
        tone={tone}
      />
      <Breadcrumb className={cn('hidden md:block', className)}>
        <BreadcrumbList
          className={cn('h-9 flex-nowrap gap-1.5 text-[13px] sm:gap-2', listClassName)}
        >
          {segments.map((segment, index) => {
            const isLast = index === lastIndex;
            const isFirst = index === 0;
            const itemClass = segment.hideOnDesktop ? 'hidden md:block' : undefined;

            return (
              <Fragment key={`${segment.label}-${index}`}>
                <BreadcrumbItem className={itemClass}>
                  {isFirst && segment.href && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link
                        href={segment.href}
                        aria-label={segment.label}
                        className={breadcrumbClassNames.rootLink}
                      >
                        <Home className="size-4" aria-hidden="true" />
                      </Link>
                    </BreadcrumbLink>
                  ) : segment.href && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href} className={breadcrumbClassNames.link}>
                        {segment.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage
                      className={cn(
                        breadcrumbClassNames.current,
                        isFirst && 'inline-flex items-center gap-2'
                      )}
                    >
                      {isFirst ? <Home className="size-4" aria-hidden="true" /> : null}
                      {segment.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbSeparator
                    className={cn(
                      breadcrumbClassNames.separator,
                      segment.hideOnDesktop && 'hidden md:flex'
                    )}
                  />
                ) : null}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
