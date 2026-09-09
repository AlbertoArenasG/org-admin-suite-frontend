import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DataTableDensity = 'compact' | 'comfortable';

type DataTablePreferencesState = {
  density: DataTableDensity;
  setDensity: (density: DataTableDensity) => void;
};

export const useDataTablePreferencesStore = create<DataTablePreferencesState>()(
  persist(
    (set) => ({
      density: 'comfortable',
      setDensity: (density) => set({ density }),
    }),
    { name: 'icsa-data-table-preferences' }
  )
);
