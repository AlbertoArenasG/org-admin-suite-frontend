import { ChevronLeft, ChevronRight } from 'lucide-react';
import { forwardRef } from 'react';

import { getPageNumbers } from './dataTablePageNumbers';
import type { DataTableLabels, DataTableProps } from './DataTable.types';

type DataTablePaginationProps = {
  pagination: NonNullable<DataTableProps<never>['pagination']>;
  labels: DataTableLabels;
};

export const DataTablePagination = forwardRef<HTMLElement, DataTablePaginationProps>(
  function DataTablePagination({ pagination, labels }, ref) {
    const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);

    return (
      <nav
        ref={ref}
        aria-label={labels.pagination}
        className="flex flex-col gap-4 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
          {pagination.onPerPageChange ? (
            <label className="flex items-center gap-2">
              {labels.rowsPerPage}
              <select
                aria-label={labels.rowsPerPage}
                value={pagination.perPage}
                onChange={(event) => pagination.onPerPageChange?.(Number(event.target.value))}
                className="h-8 rounded-md border bg-background px-2 text-foreground"
              >
                {(pagination.pageSizes ?? [10, 20, 50, 100]).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <span>
            {labels.paginationSummary({
              from: Math.min((pagination.page - 1) * pagination.perPage + 1, pagination.total),
              to: Math.min(pagination.page * pagination.perPage, pagination.total),
              total: pagination.total,
            })}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            aria-label={labels.previousPage}
            disabled={pagination.page <= 1}
            onClick={() => pagination.onChange(pagination.page - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">{labels.previousPage}</span>
          </button>
          {pageNumbers.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === pagination.page ? 'page' : undefined}
                onClick={() => pagination.onChange(item)}
                className={`size-8 rounded-md border ${item === pagination.page ? 'border-primary bg-primary text-primary-foreground' : 'bg-background'}`}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            aria-label={labels.nextPage}
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => pagination.onChange(pagination.page + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
          >
            <span className="hidden sm:inline">{labels.nextPage}</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </nav>
    );
  }
);
