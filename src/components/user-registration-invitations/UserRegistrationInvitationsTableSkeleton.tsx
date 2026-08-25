'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function UserRegistrationInvitationsTableSkeleton({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <tr
      key={`invitation-skeleton-${rowIndex}`}
      className="border-b border-border/60 last:border-b-0"
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <td key={`invitation-skeleton-${rowIndex}-${columnIndex}`} className="px-4 py-4">
          <Skeleton className={columnIndex === 0 ? 'h-4 w-48' : 'h-4 w-24'} />
        </td>
      ))}
    </tr>
  ));
}
