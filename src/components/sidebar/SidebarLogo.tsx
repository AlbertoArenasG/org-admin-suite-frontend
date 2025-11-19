import Image from 'next/image';

import { cn } from '@/lib/utils';

type SidebarLogoProps = {
  name?: string;
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
};

export function SidebarLogo({
  name = '',
  logoSrc = '/logo.jpeg',
  logoAlt = 'Company logo',
  className,
}: SidebarLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sidebar-foreground',
        'group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0',
        className
      )}
    >
      <div className="bg-white rounded-2xl p-1 shrink-0 group-data-[collapsible=icon]:p-0">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={48}
          height={48}
          className="h-12 w-12 rounded-2xl object-contain shrink-0 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10"
          priority
        />
      </div>
      {name ? (
        <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
          <span className="text-base font-semibold leading-tight">{name}</span>
        </div>
      ) : null}
    </div>
  );
}
