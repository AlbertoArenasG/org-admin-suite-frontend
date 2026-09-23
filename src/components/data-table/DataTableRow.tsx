import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronRight, Info, MessageSquareText } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';
import type { Row, RowData, TableFeatures } from '@tanstack/table-core';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableRowProps<T extends RowData, TFeatures extends TableFeatures> = {
  row: Row<TFeatures, T>;
  visibleColumns: DataTableColumn<T>[];
  selection?: DataTableProps<T>['selection'];
  hasDetails: boolean;
  expansion?: DataTableProps<T>['expansion'];
  renderDetail?: DataTableProps<T>['renderDetail'];
  getRowVisual?: DataTableProps<T>['getRowVisual'];
  getRowActions?: DataTableProps<T>['getRowActions'];
  totalColumnCount: number;
  labels: DataTableLabels;
  padding: string;
  onSelectionChange: (rowId: string, checked: boolean) => void;
  onExpansionChange: (rowId: string) => void;
};

export function DataTableRow<T extends RowData, TFeatures extends TableFeatures>({
  row,
  visibleColumns,
  selection,
  hasDetails,
  expansion,
  renderDetail,
  getRowVisual,
  getRowActions,
  totalColumnCount,
  labels,
  padding,
  onSelectionChange,
  onExpansionChange,
}: DataTableRowProps<T, TFeatures>) {
  const reduceMotion = useReducedMotion();
  const visual = getRowVisual?.(row.original);
  const isExpandable = hasDetails && (expansion?.isRowExpandable?.(row.original) ?? true);
  const isExpanded = expansion?.expandedRowIds.includes(row.id) ?? false;

  return (
    <React.Fragment>
      <tr className={`border-b hover:bg-muted/40 ${visual?.className ?? ''}`}>
        {selection ? (
          <td className="relative px-3">
            {visual?.indicatorClassName || visual?.indicatorColor ? (
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                style={
                  visual.indicatorColor ? { backgroundColor: visual.indicatorColor } : undefined
                }
              />
            ) : null}
            <input
              aria-label={labels.selectRow(row.id)}
              type="checkbox"
              disabled={!(selection.isRowSelectable?.(row.original) ?? true)}
              checked={selection.selectedRowIds.includes(row.id)}
              onChange={(event) => onSelectionChange(row.id, event.target.checked)}
            />
          </td>
        ) : null}
        {hasDetails ? (
          <td className="relative px-3">
            {(visual?.indicatorClassName || visual?.indicatorColor) && !selection ? (
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                style={
                  visual.indicatorColor ? { backgroundColor: visual.indicatorColor } : undefined
                }
              />
            ) : null}
            {isExpandable ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`detail-${row.id}`}
                    aria-label={expansion?.ariaLabel ?? labels.additionalDetails}
                    onClick={() => onExpansionChange(row.id)}
                    className={
                      expansion?.trigger === 'feedback'
                        ? 'relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        : undefined
                    }
                  >
                    {expansion?.trigger === 'information' ? (
                      <Info className="size-4" />
                    ) : expansion?.trigger === 'feedback' ? (
                      <>
                        <MessageSquareText className="size-4" />
                        {!isExpanded ? (
                          <span
                            aria-hidden
                            className="absolute right-1 top-1 size-1.5 rounded-full bg-primary"
                          />
                        ) : null}
                      </>
                    ) : isExpanded ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {expansion?.ariaLabel ?? labels.additionalDetails}
                </TooltipContent>
              </Tooltip>
            ) : null}
          </td>
        ) : null}
        {row.getAllCells().map((cell) => {
          const column = visibleColumns.find((item) => item.id === cell.column.id);
          const isFirstDataCell = cell.column.id === visibleColumns[0]?.id;
          return (
            <td
              key={cell.id}
              className={`relative px-4 ${padding} align-top ${column?.align === 'end' ? 'text-right' : column?.align === 'center' ? 'text-center' : 'text-left'} ${column?.textBehavior === 'wrap' ? 'break-words whitespace-normal' : column?.textBehavior === 'truncate' ? 'truncate whitespace-nowrap' : 'whitespace-nowrap'}`}
            >
              {(visual?.indicatorClassName || visual?.indicatorColor) &&
              !selection &&
              !hasDetails &&
              isFirstDataCell ? (
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                  style={
                    visual.indicatorColor ? { backgroundColor: visual.indicatorColor } : undefined
                  }
                />
              ) : null}
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        })}
        {getRowActions ? <td className="px-3 text-right">{getRowActions(row.original)}</td> : null}
      </tr>
      {hasDetails ? (
        <tr id={`detail-${row.id}`}>
          <td colSpan={totalColumnCount} className={isExpanded ? 'border-b bg-muted p-0' : 'p-0'}>
            <AnimatePresence initial={false}>
              {isExpanded ? (
                <motion.div
                  className="overflow-hidden"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={reduceMotion ? undefined : { duration: 0.26, ease: 'easeOut' }}
                >
                  <div className="p-4">{renderDetail?.(row.original)}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </td>
        </tr>
      ) : null}
    </React.Fragment>
  );
}
