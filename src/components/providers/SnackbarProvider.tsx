'use client';

import { useEffect, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackbarStore } from '@/components/providers/useSnackbarStore';
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const open = useSnackbarStore((state) => state.open);
  const message = useSnackbarStore((state) => state.message);
  const severity = useSnackbarStore((state) => state.severity);
  const autoHideDuration = useSnackbarStore((state) => state.autoHideDuration);
  const hideSnackbar = useSnackbarStore((state) => state.hideSnackbar);

  useEffect(() => {
    return () => {
      hideSnackbar();
    };
  }, [hideSnackbar]);

  return (
    <>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={hideSnackbar}
      >
        <Alert elevation={6} variant="filled" onClose={hideSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
