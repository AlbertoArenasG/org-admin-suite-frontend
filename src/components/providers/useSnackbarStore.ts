'use client';

import { create } from 'zustand';
import type { AlertColor } from '@mui/material/Alert';

interface SnackbarStoreState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
}

interface SnackbarStoreActions {
  showSnackbar: (payload: {
    message: string;
    severity?: AlertColor;
    autoHideDuration?: number;
  }) => void;
  hideSnackbar: () => void;
  reset: () => void;
}

const DEFAULTS: SnackbarStoreState = {
  open: false,
  message: '',
  severity: 'info',
  autoHideDuration: 4000,
};

export type SnackbarStore = SnackbarStoreState & SnackbarStoreActions;

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  ...DEFAULTS,
  showSnackbar: ({ message, severity = 'info', autoHideDuration }) => {
    set({
      open: true,
      message,
      severity,
      autoHideDuration: autoHideDuration ?? DEFAULTS.autoHideDuration,
    });
  },
  hideSnackbar: () => set({ open: false }),
  reset: () => set(DEFAULTS),
}));

export function useSnackbar() {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const hideSnackbar = useSnackbarStore((state) => state.hideSnackbar);
  const reset = useSnackbarStore((state) => state.reset);

  return { showSnackbar, hideSnackbar, reset };
}
