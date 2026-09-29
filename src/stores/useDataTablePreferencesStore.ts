import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DataTableDensity = 'compact' | 'comfortable';

type DataTablePreferencesState = {
  density: DataTableDensity;
  hasHydrated: boolean;
  pageSizeByUser: Partial<Record<string, number>>;
  setDensity: (density: DataTableDensity) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setPageSize: (userId: string, pageSize: number) => void;
};

export const useDataTablePreferencesStore = create<DataTablePreferencesState>()(
  persist(
    (set) => ({
      density: 'comfortable',
      hasHydrated: false,
      pageSizeByUser: {},
      setDensity: (density) => set({ density }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setPageSize: (userId, pageSize) =>
        set((state) => ({
          pageSizeByUser: {
            ...state.pageSizeByUser,
            [userId]: pageSize,
          },
        })),
    }),
    {
      name: 'icsa-data-table-preferences',
      partialize: (state) => ({
        density: state.density,
        pageSizeByUser: state.pageSizeByUser,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
