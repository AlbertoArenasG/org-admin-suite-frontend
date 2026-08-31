'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type { PropsWithChildren } from 'react';

const applicationFontFamily = 'var(--font-sans-stack)';

const muiTheme = createTheme({
  typography: {
    fontFamily: applicationFontFamily,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
        input: { fontFamily: applicationFontFamily },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: { fontFamily: applicationFontFamily },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: { fontFamily: applicationFontFamily },
        columnHeader: { fontFamily: applicationFontFamily },
        columnHeaderTitle: { fontFamily: applicationFontFamily },
        cell: { fontFamily: applicationFontFamily },
        footerContainer: { fontFamily: applicationFontFamily },
      },
    },
  },
});

export function MuiThemeProvider({ children }: PropsWithChildren) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
