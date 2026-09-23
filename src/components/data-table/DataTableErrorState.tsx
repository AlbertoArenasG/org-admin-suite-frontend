import type { DataTableProps } from './DataTable.types';

type DataTableErrorStateProps = {
  error: NonNullable<DataTableProps<never>['error']>;
};

export function DataTableErrorState({ error }: DataTableErrorStateProps) {
  return (
    <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <p className="font-medium">{error.message}</p>
      {error.onRetry ? (
        <button type="button" onClick={error.onRetry} className="mt-2 underline">
          Retry
        </button>
      ) : null}
    </div>
  );
}
