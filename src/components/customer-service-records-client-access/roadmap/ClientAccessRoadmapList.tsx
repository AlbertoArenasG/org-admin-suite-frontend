'use client';
import Link from 'next/link';
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/vendor/kibo-ui/list';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/vendor/kibo-ui/kanban';
import { DashboardContentReveal } from '@/components/dashboard-shell';
import { Button } from '@/components/ui/button';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import type {
  ClientAccessCustomerServiceRecord,
  ClientAccessCustomerServiceRecordsState,
} from '@/features/customer-service-records-client-access';

const STATUS_CODES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export function ClientAccessRoadmapList({
  mode,
  list,
  page,
  setPage,
  onRetry,
}: {
  mode: 'list' | 'kanban';
  list: ClientAccessCustomerServiceRecordsState['list'];
  page: number;
  setPage: (page: number) => void;
  onRetry: () => void;
}) {
  const { t } = useTranslationHydrated('clientAccessServices');
  const rows = list.status === 'loading' ? [] : list.items;
  const groups = STATUS_CODES.map((code) => ({
    id: code,
    name:
      rows.find((row) => row.operationalStatus.code === code)?.operationalStatus.name ??
      t(`roadmap.status.${code}`),
    items: rows.filter((row) => row.operationalStatus.code === code),
  }));
  const href = (row: ClientAccessCustomerServiceRecord) => `/dashboard/portal/services/${row.id}`;
  if (list.status === 'failed')
    return (
      <div role="alert" className="space-y-3 rounded-md border p-4">
        <p>{list.error}</p>
        <Button onClick={onRetry}>{t('actions.retry')}</Button>
      </div>
    );
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" role="status">
        {list.status === 'loading'
          ? t('roadmap.loading')
          : t('roadmap.pageSummary', { page, total: list.total })}
      </p>
      {list.status === 'succeeded' && (
        <DashboardContentReveal key={`${mode}-${page}`}>
          {rows.length === 0 ? (
            <p className="rounded-md border p-6 text-sm">{t('roadmap.empty')}</p>
          ) : mode === 'list' ? (
            <ListProvider onDragEnd={() => undefined} className="gap-4">
              {groups
                .filter((group) => group.items.length)
                .map((group) => (
                  <ListGroup id={group.id} key={group.id}>
                    <ListHeader name={group.name} color="var(--primary)" />
                    <ListItems>
                      {group.items.map((row, index) => (
                        <ListItem
                          readOnly
                          id={row.id}
                          index={index}
                          parent={group.id}
                          name={row.serviceNumberDisplay}
                          key={row.id}
                        >
                          <Link
                            href={href(row)}
                            className="min-w-0 flex-1 rounded p-1 focus-visible:outline-2 focus-visible:outline-primary"
                          >
                            <span className="font-medium">{row.serviceNumberDisplay}</span>
                            <span className="ml-3 text-muted-foreground">
                              {row.customer.name} ·{' '}
                              {row.assets.map((asset) => asset.name).join(', ') ||
                                row.serviceType.name}
                            </span>
                          </Link>
                        </ListItem>
                      ))}
                    </ListItems>
                  </ListGroup>
                ))}
            </ListProvider>
          ) : (
            <div className="overflow-x-auto">
              <KanbanProvider
                columns={groups}
                data={rows.map((row) => ({
                  id: row.id,
                  name: row.serviceNumberDisplay,
                  column: row.operationalStatus.code,
                  row,
                }))}
                className="min-w-[800px]"
              >
                {(column) => (
                  <KanbanBoard id={column.id} key={column.id}>
                    <KanbanHeader>
                      {column.name} ({column.items.length})
                    </KanbanHeader>
                    <KanbanCards id={column.id}>
                      {(item: {
                        id: string;
                        name: string;
                        column: string;
                        row: ClientAccessCustomerServiceRecord;
                      }) => (
                        <KanbanCard
                          readOnly
                          id={item.id}
                          name={item.name}
                          column={item.column}
                          key={item.id}
                        >
                          <Link
                            href={href(item.row)}
                            className="block rounded focus-visible:outline-2 focus-visible:outline-primary"
                          >
                            <strong>{item.name}</strong>
                            <p className="mt-1 text-muted-foreground">{item.row.customer.name}</p>
                            <p>
                              {item.row.assets.map((asset) => asset.name).join(', ') ||
                                item.row.serviceType.name}
                            </p>
                          </Link>
                        </KanbanCard>
                      )}
                    </KanbanCards>
                  </KanbanBoard>
                )}
              </KanbanProvider>
            </div>
          )}
        </DashboardContentReveal>
      )}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || list.status === 'loading'}
          onClick={() => setPage(page - 1)}
        >
          {t('roadmap.previous')}
        </Button>
        <span className="text-sm">
          {page} / {Math.max(1, list.totalPages)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= list.totalPages || list.status === 'loading'}
          onClick={() => setPage(page + 1)}
        >
          {t('roadmap.next')}
        </Button>
      </div>
    </div>
  );
}
