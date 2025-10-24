'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchUsers } from '@/features/users/usersThunks';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import LinearProgress from '@mui/material/LinearProgress';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridPaginationModel,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function UsersPage() {
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
        createdAt: formatDate(user.createdAt),
      })),
    [entities]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'fullName',
        headerName: 'Usuario',
        flex: 1.5,
        minWidth: 180,
      },
      {
        field: 'email',
        headerName: 'Correo electrónico',
        flex: 1.8,
        minWidth: 220,
      },
      {
        field: 'roleName',
        headerName: 'Rol',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'statusName',
        headerName: 'Estado',
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
          if (normalized === 'invited' || normalized === 'pending') {
            return <Chip color="warning" variant="outlined" size="small" label={label} />;
          }
          return <Chip color="error" variant="outlined" size="small" label={label} />;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Creado',
        flex: 1,
        minWidth: 160,
      },
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

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
              Usuarios
            </Typography>
          </div>
          {pagination ? (
            <Typography variant="caption" color="text.secondary">
              Página {pagination.page} de {pagination.totalPages} · {pagination.total} usuarios
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
              <AlertTitle>Ocurrió un problema</AlertTitle>
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
              noRowsLabel: 'No hay usuarios para mostrar.',
            }}
          />
        </Box>
      </Paper>
    </div>
  );
}
