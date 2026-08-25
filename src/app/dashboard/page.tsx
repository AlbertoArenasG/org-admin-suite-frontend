import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <div className="flex flex-1">
      <SidebarTrigger className="fixed top-4 left-4 z-20 rounded-lg border border-border/60 bg-card/90 shadow-sm backdrop-blur" />
    </div>
  );
}
