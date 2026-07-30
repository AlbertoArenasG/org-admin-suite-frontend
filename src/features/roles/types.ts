export type RoleScope = 'MASTER_ADMIN' | 'ADMIN' | 'USER';
export type RoleStatusId = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';
export type RoleSortField = 'name' | 'code' | 'status' | 'created_at';

export interface RolePermission {
  module: string;
  operation: string;
}

export interface RoleActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface RoleListItem {
  roleId: string;
  name: string;
  code: string;
  scope: RoleScope;
  isSystem: boolean;
  isImmutable: boolean;
  isDefault: boolean;
  statusId: RoleStatusId;
  permissions: RolePermission[];
  createdBy: RoleActorSummary | null;
  updatedBy: RoleActorSummary | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type RoleDetail = RoleListItem;

export interface RoleModuleCatalogItem {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleNameKey: string;
  statusId: string;
  isSystem: boolean;
}

export interface RoleOperationCatalogItem {
  operationId: string;
  operationCode: string;
  operationName: string;
  operationNameKey: string;
  statusId: string;
  isSystem: boolean;
}

export interface RoleListFilters {
  scope: RoleScope | null;
  status: RoleStatusId | null;
  isSystem: boolean | null;
}

export interface RoleListSort {
  field: RoleSortField;
  direction: SortDirection;
}

export interface FetchRolesParams {
  page?: number;
  limit?: number;
  search?: string | null;
  filters?: Partial<RoleListFilters>;
  sorts?: RoleListSort[];
}

export interface FetchRolesResult {
  items: RoleListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRolePayload {
  name: string;
  permissions: RolePermission[];
}

export interface UpdateRolePayload {
  roleId: string;
  permissions: RolePermission[];
}

export interface ChangeRoleStatusPayload {
  roleId: string;
  statusId: Extract<RoleStatusId, 'ACTIVE' | 'INACTIVE'>;
}

export interface DeleteRolePayload {
  roleId: string;
}

export interface RolesState {
  list: {
    items: RoleListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: RoleListFilters;
    sorts: RoleListSort[];
  };
  detail: {
    item: RoleDetail | null;
    status: RequestStatus;
    error: string | null;
    currentRoleId: string | null;
  };
  catalogs: {
    modules: RoleModuleCatalogItem[];
    operations: RoleOperationCatalogItem[];
    status: RequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    changeStatusStatus: RequestStatus;
    deleteStatus: RequestStatus;
    error: string | null;
    lastCreatedRoleId: string | null;
    currentRoleId: string | null;
    message: string | null;
  };
}
