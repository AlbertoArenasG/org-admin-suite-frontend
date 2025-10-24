'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { MoreVertical, Pencil, Trash2, UserPlus } from 'lucide-react';

import { fetchUsers } from '@/features/users/usersThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/features/users/usersSlice';
import {
  USER_ROLE_LIST,
  ROLE_RANK,
  canInviteRole,
  canManageRole,
  parseUserRole,
} from '@/features/users/roles';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { UserForm, type UserFormValues } from '@/components/users/UserForm';

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

interface TableRow {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  roleId: ReturnType<typeof parseUserRole>;
  status: string;
  statusName: string;
  phone: string | null;
  createdAt: string;
}

function mapUserToFormValues(user: User): UserFormValues {
  const roleId = parseUserRole(user.role);
  return {
    email: user.email,
    roleId,
    name: user.name ?? '',
    lastname: user.lastname ?? '',
    cellPhone: {
      countryCode: user.cellPhone?.countryCode ?? '',
      number: user.cellPhone?.number ?? '',
    },
  };
}

interface UserRowActionsProps {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  labels: {
    menu: string;
    edit: string;
    delete: string;
  };
}

function UserRowActions({ canEdit, canDelete, onEdit, onDelete, labels }: UserRowActionsProps) {
  const hasActions = canEdit || canDelete;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label={labels.menu}
          disabled={!hasActions}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      {hasActions ? (
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          {canEdit ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                onEdit();
              }}
            >
              <Pencil className="size-4" />
              {labels.edit}
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                onDelete();
              }}
            >
              <Trash2 className="size-4" />
              {labels.delete}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
}

export function UsersTable() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { entities, status, error, pagination } = useAppSelector((state) => state.users);
  const authUser = useAppSelector((state) => state.auth.user);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const currentRole = authUser?.role ?? null;

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

  const userById = useMemo(() => {
    const map = new Map<string, User>();
    entities.forEach((user) => {
      map.set(user.id, user);
    });
    return map;
  }, [entities]);

  const rows = useMemo(
    () =>
      entities.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleName: user.roleName,
        roleId: parseUserRole(user.role),
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

  const inviteRoleOptions = useMemo(
    () =>
      USER_ROLE_LIST.filter((role) => canInviteRole(currentRole, role)).map((role) => ({
        value: role,
        label: t(`users.roles.${role}`),
      })),
    [currentRole, t]
  );

  const baseManageableRoles = useMemo(
    () =>
      USER_ROLE_LIST.filter((role) =>
        currentRole ? ROLE_RANK[currentRole] < ROLE_RANK[role] : false
      ),
    [currentRole]
  );

  const editTarget = editTargetId ? (userById.get(editTargetId) ?? null) : null;
  const editTargetRole = editTarget ? parseUserRole(editTarget.role) : null;

  const editRoleOptions = useMemo(() => {
    if (!currentRole) {
      return [] as Array<{ value: ReturnType<typeof parseUserRole>; label: string }>;
    }

    const options = baseManageableRoles.map((role) => ({
      value: role,
      label: t(`users.roles.${role}`),
    }));

    if (editTargetRole && !options.find((option) => option.value === editTargetRole)) {
      options.push({ value: editTargetRole, label: t(`users.roles.${editTargetRole}`) });
    }

    return options;
  }, [baseManageableRoles, editTargetRole, currentRole, t]);

  const deleteTarget = deleteTargetId ? (userById.get(deleteTargetId) ?? null) : null;

  const handleInviteSubmit = useCallback((values: UserFormValues) => {
    console.log('Invite user payload', values);
    setInviteOpen(false);
  }, []);

  const handleRequestEdit = useCallback(
    (id: string) => {
      const target = userById.get(id);
      if (!target || !currentRole) {
        return;
      }
      const targetRole = parseUserRole(target.role);
      const isSelf = authUser?.id === id;
      if (!canManageRole(currentRole, targetRole, { allowSameLevel: isSelf })) {
        return;
      }
      setEditTargetId(id);
    },
    [authUser?.id, currentRole, userById]
  );

  const handleEditSubmit = useCallback(
    (values: UserFormValues) => {
      if (!editTargetId) {
        return;
      }
      console.log('Update user payload', { userId: editTargetId, values });
      setEditTargetId(null);
    },
    [editTargetId]
  );

  const handleRequestDelete = useCallback(
    (id: string) => {
      const target = userById.get(id);
      if (!target || !currentRole) {
        return;
      }
      const targetRole = parseUserRole(target.role);
      const isSelf = authUser?.id === id;
      if (isSelf || !canManageRole(currentRole, targetRole)) {
        return;
      }
      setDeleteTargetId(id);
    },
    [authUser?.id, currentRole, userById]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTargetId) {
      return;
    }
    console.log('Delete user payload', { userId: deleteTargetId });
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  const actionsColumn: GridColDef<TableRow> = useMemo(
    () => ({
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 72,
      align: 'center',
      headerAlign: 'center',
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<TableRow, string>) => {
        const row = params.row;
        const isSelf = authUser?.id === row.id;
        const canEdit = currentRole
          ? canManageRole(currentRole, row.roleId, { allowSameLevel: isSelf })
          : false;
        const canDelete = currentRole ? !isSelf && canManageRole(currentRole, row.roleId) : false;
        return (
          <UserRowActions
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={() => handleRequestEdit(row.id)}
            onDelete={() => handleRequestDelete(row.id)}
            labels={{
              menu: t('users.actions.openMenu'),
              edit: t('users.actions.edit'),
              delete: t('users.actions.delete'),
            }}
          />
        );
      },
    }),
    [authUser?.id, currentRole, handleRequestDelete, handleRequestEdit, t]
  );

  const columns = useMemo<GridColDef<TableRow>[]>(
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
        renderCell: (params: GridRenderCellParams<TableRow, string>) => {
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
      actionsColumn,
    ],
    [actionsColumn, t]
  );

  const canInvite = currentRole !== null && inviteRoleOptions.length > 0;
  const inviteDefaults = useMemo<UserFormValues>(() => {
    const defaultRole = inviteRoleOptions[0]?.value ?? 'STAFF';
    return {
      email: '',
      roleId: defaultRole,
      name: '',
      lastname: '',
      cellPhone: { countryCode: '', number: '' },
    };
  }, [inviteRoleOptions]);

  const editDefaults = useMemo<UserFormValues | undefined>(() => {
    if (!editTarget) {
      return undefined;
    }
    return mapUserToFormValues(editTarget);
  }, [editTarget]);

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
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {t('users.title')}
          </Typography>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {pagination ? (
            <Typography variant="caption" color="text.secondary">
              {t('users.pagination', {
                page: pagination.page,
                pages: pagination.totalPages,
                total: pagination.total,
              })}
            </Typography>
          ) : null}
          <Button
            type="button"
            size="sm"
            onClick={() => setInviteOpen(true)}
            disabled={!canInvite}
            aria-label={t('users.actions.openInvite')}
          >
            <UserPlus className="size-4" />
            {t('users.actions.inviteShort')}
          </Button>
        </Box>
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
        <DataGrid<TableRow>
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

      <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('users.form.title.create')}</SheetTitle>
            <SheetDescription>{t('users.form.description.create')}</SheetDescription>
          </SheetHeader>
          <UserForm
            mode="create"
            defaultValues={inviteDefaults}
            onSubmit={handleInviteSubmit}
            onCancel={() => setInviteOpen(false)}
            roleOptions={inviteRoleOptions}
          />
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setEditTargetId(null);
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('users.form.title.edit')}</SheetTitle>
            <SheetDescription>{t('users.form.description.edit')}</SheetDescription>
          </SheetHeader>
          {editTarget && editDefaults ? (
            <UserForm
              mode="edit"
              defaultValues={editDefaults}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditTargetId(null)}
              roleOptions={editRoleOptions}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTargetId(null);
          }
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('users.confirmDelete.title')}</SheetTitle>
            <SheetDescription>
              {t('users.confirmDelete.description', {
                name: deleteTarget?.fullName ?? deleteTarget?.email ?? '—',
              })}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-auto flex-col gap-2">
            <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
              {t('users.confirmDelete.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('users.confirmDelete.confirm')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Paper>
  );
}
