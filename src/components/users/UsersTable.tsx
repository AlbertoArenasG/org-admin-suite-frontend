'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Chip from '@mui/material/Chip';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { fetchUsers } from '@/features/users/usersThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

function formatDate(isoDate: string, locale: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function UsersTable() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { entities, status, error, pagination } = useAppSelector((state) => state.users);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    void dispatch(
      fetchUsers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    if (!pagination) {
      return;
    }

    setPaginationModel((current) => {
      const newPage = Math.max(0, Math.min(pagination.page - 1, pagination.totalPages - 1));
      const newPageSize = pagination.perPage;
      if (current.page === newPage && current.pageSize === newPageSize) {
        return current;
      }
      return { page: newPage, pageSize: newPageSize };
    });
  }, [pagination]);

  const isLoading = status === 'loading';
  const totalCount = pagination?.total ?? entities.length;

  const rows = useMemo(
    () =>
      entities.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleName: user.roleName,
        status: user.status,
        statusName: user.statusName,
        phone:
          user.cellPhone && user.cellPhone.number
            ? `${user.cellPhone.countryCode} ${user.cellPhone.number}`
            : null,
        createdAt: formatDate(user.createdAt, i18n.language ?? 'es-MX'),
      })),
    [entities, i18n.language]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'fullName',
        headerName: t('users.table.columns.fullName'),
        flex: 1.5,
        minWidth: 180,
      },
      {
        field: 'email',
        headerName: t('users.table.columns.email'),
        flex: 1.8,
        minWidth: 220,
      },
      {
        field: 'roleName',
        headerName: t('users.table.columns.role'),
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'statusName',
        headerName: t('users.table.columns.status'),
        flex: 1,
        minWidth: 140,
        sortable: true,
        renderCell: (params: GridRenderCellParams<(typeof rows)[number], string>) => {
          const status = params.row.status;
          const label = params.value ?? '';
          const normalized = typeof status === 'string' ? status.toLowerCase() : '';

          if (normalized === 'active') {
            return <Chip color="success" variant="outlined" size="small" label={label} />;
          }

          if (normalized === 'inactive') {
            return <Chip color="default" variant="outlined" size="small" label={label} />;
          }

          return <Chip color="warning" variant="outlined" size="small" label={label} />;
        },
      },
      {
        field: 'createdAt',
        headerName: t('users.table.columns.createdAt'),
        flex: 1,
        minWidth: 140,
      },
    ],
    [rows, t]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 3,
          borderBottom: '1px solid var(--surface-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {t('users.title')}
          </Typography>
        </div>
        {pagination ? (
          <Typography variant="caption" color="text.secondary">
            {t('users.pagination', {
              page: pagination.page,
              pages: pagination.totalPages,
              total: pagination.total,
            })}
          </Typography>
        ) : null}
      </Box>

      {isLoading ? (
        <LinearProgress
          sx={{
            backgroundColor: 'var(--data-grid-progress-track)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--data-grid-progress-bar)',
            },
          }}
        />
      ) : null}

      {error ? (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert severity="error">
            <AlertTitle>{t('errorTitle')}</AlertTitle>
            {error}
          </Alert>
        </Box>
      ) : null}

      <Box sx={{ flex: 1, position: 'relative' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          paginationMode="server"
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={isLoading}
          sx={{
            border: 0,
            height: '100%',
            color: 'var(--foreground)',
            backgroundColor: 'transparent',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--data-grid-header-bg)',
              borderBottom: '1px solid var(--data-grid-header-border)',
              color: 'var(--foreground)',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'var(--data-grid-header-bg)',
              color: 'var(--foreground)',
            },
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
            },
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'var(--data-grid-cell-border) !important',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'var(--data-grid-row-hover)',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: 'var(--primary-50)',
              '&:hover': {
                backgroundColor: 'var(--primary-100)',
              },
            },
            '& .MuiCheckbox-root.Mui-checked': {
              color: 'var(--primary-500)',
            },
            '& .MuiCheckbox-root .MuiSvgIcon-root': {
              fill: 'var(--foreground)',
            },
            '& .MuiButtonBase-root.MuiIconButton-root': {
              color: 'var(--muted-foreground)',
            },
            '& .MuiButtonBase-root.MuiIconButton-root:hover': {
              backgroundColor: 'var(--muted)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid var(--surface-border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
            },
            '& .MuiTablePagination-root': {
              color: 'inherit',
            },
          }}
          localeText={{
            noRowsLabel: t('users.empty'),
          }}
        />
      </Box>
    </Paper>
  );
}
