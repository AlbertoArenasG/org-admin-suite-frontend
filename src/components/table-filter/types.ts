import type { ReactNode } from 'react';

export interface TableFilterOption {
  value: string;
  label: string;
  description?: string;
}

export type TableFilterSelection = 'single' | 'multiple';

export type TableFilterControlOrientation = 'vertical' | 'responsive';

export type TableFilterSectionLayout = 'one-column' | 'two-columns';

export interface TableFilterDateField {
  id: string;
  label: string;
}

export interface TableFilterDateRangeValue {
  fieldId: string | null;
  from: string | null;
  to: string | null;
}

export type TableFilterDatePresetId =
  | 'previous-week'
  | 'current-week'
  | 'next-week'
  | 'previous-month'
  | 'current-month'
  | 'next-month';

export interface TableFilterDatePreset {
  id: TableFilterDatePresetId;
  label: string;
}

export interface TableFilterRenderState<TValue> {
  draft: TValue;
  isDirty: boolean;
  setDraft: (updater: (current: TValue) => TValue) => void;
}

export interface TableFilterDialogLabels {
  title: ReactNode;
  clear: string;
  cancel: string;
  apply: string;
  showAll: string;
  applyAriaLabel?: string;
}
