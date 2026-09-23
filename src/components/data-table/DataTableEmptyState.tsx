import type { ReactNode } from 'react';

import type { DataTableLabels } from './DataTable.types';

type DataTableEmptyStateProps = {
  totalColumnCount: number;
  hasActiveCriteria: boolean;
  renderEmpty?: (context: { filtered: boolean; onClearCriteria?: () => void }) => ReactNode;
  onClearCriteria?: () => void;
  labels: DataTableLabels;
};

export function DataTableEmptyState({
  totalColumnCount,
  hasActiveCriteria,
  renderEmpty,
  onClearCriteria,
  labels,
}: DataTableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={totalColumnCount} className="p-12 text-center text-muted-foreground">
        {renderEmpty?.({ filtered: hasActiveCriteria, onClearCriteria }) ??
          (hasActiveCriteria ? (
            <>
              <p>{labels.noResultsForCriteria}</p>
              {onClearCriteria ? (
                <button type="button" onClick={onClearCriteria} className="mt-2 underline">
                  {labels.clearCriteria}
                </button>
              ) : null}
            </>
          ) : (
            labels.noResults
          ))}
      </td>
    </tr>
  );
}
