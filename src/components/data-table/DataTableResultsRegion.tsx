import { forwardRef, type CSSProperties, type ReactNode } from 'react';

type DataTableResultsRegionProps = {
  className: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const DataTableResultsRegion = forwardRef<HTMLDivElement, DataTableResultsRegionProps>(
  function DataTableResultsRegion({ className, style, children }, ref) {
    return (
      <div
        ref={ref}
        className={`min-h-0 ${className}`}
        style={style}
        aria-label="Data table results"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
);
