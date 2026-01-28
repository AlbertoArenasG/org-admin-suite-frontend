export function getProviderStatusTone(statusId: string) {
  switch (statusId) {
    case 'ACTIVE':
      return 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200';
    case 'INACTIVE':
    case 'SUSPENDED':
      return 'bg-amber-100/70 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200';
    case 'BLOCKED':
      return 'bg-rose-100/70 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getProviderProfileTone(statusId: string) {
  switch (statusId) {
    case 'COMPLETED':
      return 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200';
    case 'PENDING':
      return 'bg-amber-100/70 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200';
    case 'REJECTED':
      return 'bg-rose-100/70 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
}
