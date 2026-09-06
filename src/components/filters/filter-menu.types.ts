export interface DashboardFilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DashboardFilterCategory {
  id: string;
  label: string;
  options: readonly DashboardFilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
}
