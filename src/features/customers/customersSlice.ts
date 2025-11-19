import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/features/customers/customersThunks';

export interface CustomerAddress {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  delegation: string | null;
  city: string | null;
  postalCode: string | null;
}

export interface CustomerCfdiDetails {
  use: string | null;
  paymentMethod: string | null;
  paymentForm: string | null;
}

export interface CustomerContact {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface CustomerFileMetadata {
  fileId: string;
  originalName: string;
  extension: string;
  downloadUrl: string;
}

export interface CustomerFiscalProfile {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  businessName: string | null;
  rfc: string | null;
  taxRegime: string | null;
  address: CustomerAddress | null;
  cfdi: CustomerCfdiDetails | null;
  billingContact: CustomerContact | null;
  accountsPayableContact: CustomerContact | null;
  requirementsNotes: string | null;
  taxCertificateFileId: string | null;
  invoiceRequirementsFileId: string | null;
  filesMetadata: {
    taxCertificate?: CustomerFileMetadata | null;
    invoiceRequirements?: CustomerFileMetadata | null;
  } | null;
}

export interface Customer {
  id: string;
  companyName: string;
  clientCode: string;
  statusId: string;
  statusName: string;
  publicAccessToken: string | null;
  publicAccessUrl: string | null;
  createdAt: string;
  updatedAt: string;
  fiscalProfile: CustomerFiscalProfile | null;
}

export interface CustomersPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface CustomersState {
  items: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: CustomersPagination | null;
  detail: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentId: string | null;
    entry: Customer | null;
  };
  create: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastCreatedId: string | null;
    message: string | null;
  };
  update: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastUpdatedId: string | null;
    message: string | null;
  };
  delete: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastDeletedId: string | null;
    message: string | null;
  };
}

const initialState: CustomersState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: null,
  detail: {
    status: 'idle',
    error: null,
    currentId: null,
    entry: null,
  },
  create: {
    status: 'idle',
    error: null,
    lastCreatedId: null,
    message: null,
  },
  update: {
    status: 'idle',
    error: null,
    lastUpdatedId: null,
    message: null,
  },
  delete: {
    status: 'idle',
    error: null,
    lastDeletedId: null,
    message: null,
  },
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    resetCustomersState() {
      return initialState;
    },
    resetCustomerDetail(state) {
      state.detail = {
        status: 'idle',
        error: null,
        currentId: null,
        entry: null,
      };
    },
    resetCustomerCreate(state) {
      state.create = {
        status: 'idle',
        error: null,
        lastCreatedId: null,
        message: null,
      };
    },
    resetCustomerUpdate(state) {
      state.update = {
        status: 'idle',
        error: null,
        lastUpdatedId: null,
        message: null,
      };
    },
    resetCustomerDelete(state) {
      state.delete = {
        status: 'idle',
        error: null,
        lastDeletedId: null,
        message: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.customers;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la lista de clientes';
      })
      .addCase(fetchCustomerById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentId = action.meta.arg.id;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.entry = action.payload;
        state.detail.error = null;
        state.detail.currentId = action.payload.id;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el cliente';
        state.detail.entry = null;
      })
      .addCase(createCustomer.pending, (state) => {
        state.create.status = 'loading';
        state.create.error = null;
        state.create.lastCreatedId = null;
        state.create.message = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.create.status = 'succeeded';
        state.create.error = null;
        state.create.lastCreatedId = action.payload.customer.id;
        state.create.message = action.payload.message ?? null;
        state.items = [action.payload.customer, ...state.items];
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.create.status = 'failed';
        state.create.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el cliente';
        state.create.lastCreatedId = null;
        state.create.message = null;
      })
      .addCase(updateCustomer.pending, (state, action) => {
        state.update.status = 'loading';
        state.update.error = null;
        state.update.lastUpdatedId = action.meta.arg.id;
        state.update.message = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.update.status = 'succeeded';
        state.update.error = null;
        state.update.lastUpdatedId = action.payload.customer.id;
        state.update.message = action.payload.message ?? null;
        const index = state.items.findIndex((item) => item.id === action.payload.customer.id);
        if (index >= 0) {
          state.items[index] = action.payload.customer;
        } else {
          state.items = [action.payload.customer, ...state.items];
        }
        if (state.detail.entry && state.detail.entry.id === action.payload.customer.id) {
          state.detail.entry = action.payload.customer;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.update.status = 'failed';
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el cliente';
        state.update.message = null;
      })
      .addCase(deleteCustomer.pending, (state, action) => {
        state.delete.status = 'loading';
        state.delete.error = null;
        state.delete.lastDeletedId = action.meta.arg.id;
        state.delete.message = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.delete.status = 'succeeded';
        state.delete.error = null;
        state.delete.lastDeletedId = action.payload.id;
        state.delete.message = action.payload.message ?? null;
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        if (state.detail.entry?.id === action.payload.id) {
          state.detail.entry = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.delete.status = 'failed';
        state.delete.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el cliente';
        state.delete.message = null;
      });
  },
});

export const {
  resetCustomersState,
  resetCustomerDetail,
  resetCustomerCreate,
  resetCustomerUpdate,
  resetCustomerDelete,
} = customersSlice.actions;
export default customersSlice.reducer;
