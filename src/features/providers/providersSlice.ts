import { createSlice } from '@reduxjs/toolkit';
import {
  createProvider,
  fetchProviderById,
  fetchProviders,
} from '@/features/providers/providersThunks';

export interface ProviderContact {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface ProviderFileMetadata {
  fileId: string;
  originalName: string;
  extension: string;
  downloadUrl: string;
}

export interface ProviderFiscalAddress {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

export interface ProviderBillingContact {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface ProviderFiscalProfile {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  businessName: string | null;
  rfc: string | null;
  address: ProviderFiscalAddress | null;
  billingContact: ProviderBillingContact | null;
  notes: string | null;
  taxStatusCertificateFileId: string | null;
  taxComplianceOpinionFileId: string | null;
  addressProofFileId: string | null;
  filesMetadata: {
    taxStatusCertificate?: ProviderFileMetadata | null;
    taxComplianceOpinion?: ProviderFileMetadata | null;
    addressProof?: ProviderFileMetadata | null;
  } | null;
}

export interface ProviderBankingInfo {
  id: string;
  statusId: string;
  statusName: string;
  submittedAt: string | null;
  beneficiary: string | null;
  bank: string | null;
  accountNumber: string | null;
  clabe: string | null;
  creditGranted: string | null;
  notes: string | null;
  bankStatementFileId: string | null;
  filesMetadata: {
    bankStatement?: ProviderFileMetadata | null;
  } | null;
}

export interface Provider {
  id: string;
  companyName: string;
  providerCode: string;
  statusId: string;
  statusName: string;
  publicAccessToken: string | null;
  publicAccessUrl: string | null;
  contact: ProviderContact | null;
  createdAt: string;
  updatedAt: string;
  fiscalProfile: ProviderFiscalProfile | null;
  bankingInfo: ProviderBankingInfo | null;
}

export interface ProvidersPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ProvidersState {
  items: Provider[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: ProvidersPagination | null;
  detail: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentId: string | null;
    entry: Provider | null;
  };
  create: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastCreatedId: string | null;
    message: string | null;
  };
}

const initialState: ProvidersState = {
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
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    resetProvidersState() {
      return initialState;
    },
    resetProviderDetail(state) {
      state.detail = {
        status: 'idle',
        error: null,
        currentId: null,
        entry: null,
      };
    },
    resetProviderCreate(state) {
      state.create = {
        status: 'idle',
        error: null,
        lastCreatedId: null,
        message: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.providers;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la lista de proveedores';
      })
      .addCase(fetchProviderById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentId = action.meta.arg.id;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.entry = action.payload;
        state.detail.error = null;
        state.detail.currentId = action.payload.id;
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el proveedor';
        state.detail.entry = null;
      })
      .addCase(createProvider.pending, (state) => {
        state.create.status = 'loading';
        state.create.error = null;
        state.create.lastCreatedId = null;
        state.create.message = null;
      })
      .addCase(createProvider.fulfilled, (state, action) => {
        state.create.status = 'succeeded';
        state.create.error = null;
        state.create.lastCreatedId = action.payload.provider.id;
        state.create.message = action.payload.message ?? null;
        state.items = [action.payload.provider, ...state.items];
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.create.status = 'failed';
        state.create.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el proveedor';
        state.create.lastCreatedId = null;
        state.create.message = null;
      });
  },
});

export const { resetProvidersState, resetProviderDetail, resetProviderCreate } =
  providersSlice.actions;
export default providersSlice.reducer;
