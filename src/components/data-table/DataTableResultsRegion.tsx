import { forwardRef, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react';

import { DataTableScrollControls } from './DataTableScrollControls';

type DataTableResultsRegionProps = {
  className: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const DataTableResultsRegion = forwardRef<HTMLDivElement, DataTableResultsRegionProps>(
  function DataTableResultsRegion({ className, style, children }, ref) {
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => scrollViewportRef.current as HTMLDivElement, []);

    return (
      <div className={`relative min-h-0 ${className.includes('flex-1') ? 'flex-1' : ''}`}>
        <div
          ref={scrollViewportRef}
          className={`min-h-0 ${className}`}
          style={style}
          aria-label="Data table results"
          tabIndex={0}
        >
          {children}
        </div>
        <DataTableScrollControls scrollViewportRef={scrollViewportRef} />
      </div>
    );
  }
);
