import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-2 rounded-2xl border border-secondary-100/40 bg-white/90 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-2xl border border-secondary-100/20 bg-muted/40" />
          <div className="aspect-video rounded-2xl border border-secondary-100/20 bg-muted/40" />
          <div className="aspect-video rounded-2xl border border-secondary-100/20 bg-muted/40" />
        </div>
        <div className="min-h-[40vh] flex-1 rounded-2xl border border-secondary-100/20 bg-muted/40" />
      </div>
    </div>
  );
}
