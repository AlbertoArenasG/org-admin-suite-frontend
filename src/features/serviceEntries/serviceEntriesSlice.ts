'use client';

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchServiceEntries,
  fetchServiceEntryById,
  createServiceEntry,
  updateServiceEntry,
  deleteServiceEntry,
  uploadServiceEntryFiles,
} from '@/features/serviceEntries/serviceEntriesThunks';

export interface ServiceEntryFileMetadata {
  file_id: string;
  original_name: string;
  extension: string;
  download_url: string;
}

export interface ServiceEntry {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  serviceOrderIdentifier: string;
  categoryId: string;
  categoryName: string;
  calibrationCertificateFileId: string | null;
  attachmentFileIds: string[];
  statusId: string;
  statusName: string;
  surveyAccessId: string | null;
  surveyTemplate: {
    template_id: string;
    version: number;
  } | null;
  createdAt: string;
  updatedAt: string | null;
  filesMetadata: {
    calibration_certificate?: ServiceEntryFileMetadata | null;
    attachments?: ServiceEntryFileMetadata[] | null;
  } | null;
  surveyStatus: {
    completed: boolean;
    submitted_at: string | null;
  } | null;
  downloadStatus: {
    has_download: boolean;
    last_downloaded_at: string | null;
    download_count: number;
  } | null;
  publicAccessToken: string | null;
}

export type ServiceEntryDetail = ServiceEntry;

export interface ServiceEntriesState {
  entities: ServiceEntry[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  detail: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    entry: ServiceEntryDetail | null;
  };
  form: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    lastCreatedId: string | null;
  };
  delete: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    targetId: string | null;
    message: string | null;
  };
  upload: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    files: ServiceEntryFileMetadata[];
  };
}

const initialState: ServiceEntriesState = {
  entities: [],
  pagination: null,
  status: 'idle',
  error: null,
  detail: {
    status: 'idle',
    error: null,
    entry: null,
  },
  form: {
    status: 'idle',
    error: null,
    lastCreatedId: null,
  },
  delete: {
    status: 'idle',
    error: null,
    targetId: null,
    message: null,
  },
  upload: {
    status: 'idle',
    error: null,
    files: [],
  },
};

const serviceEntriesSlice = createSlice({
  name: 'serviceEntries',
  initialState,
  reducers: {
    resetServiceEntriesState() {
      return initialState;
    },
    resetServiceEntryDetail(state) {
      state.detail = {
        status: 'idle',
        error: null,
        entry: null,
      };
    },
    resetServiceEntryForm(state) {
      state.form = {
        status: 'idle',
        error: null,
        lastCreatedId: null,
      };
    },
    resetServiceEntryDelete(state) {
      state.delete = {
        status: 'idle',
        error: null,
        targetId: null,
        message: null,
      };
    },
    resetServiceEntryUpload(state) {
      state.upload = {
        status: 'idle',
        error: null,
        files: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceEntries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchServiceEntries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload.entries;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchServiceEntries.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las entradas de servicio';
      })
      .addCase(fetchServiceEntryById.pending, (state) => {
        state.detail.status = 'loading';
        state.detail.error = null;
      })
      .addCase(fetchServiceEntryById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.entry = action.payload;
        state.detail.error = null;
      })
      .addCase(fetchServiceEntryById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la entrada de servicio';
        state.detail.entry = null;
      })
      .addCase(createServiceEntry.pending, (state) => {
        state.form.status = 'loading';
        state.form.error = null;
        state.form.lastCreatedId = null;
      })
      .addCase(createServiceEntry.fulfilled, (state, action) => {
        const entry = action.payload;
        state.form.status = 'succeeded';
        state.form.error = null;
        state.form.lastCreatedId = entry.id;
        state.entities.unshift(entry);
      })
      .addCase(createServiceEntry.rejected, (state, action) => {
        state.form.status = 'failed';
        state.form.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear la entrada de servicio';
      })
      .addCase(updateServiceEntry.pending, (state) => {
        state.form.status = 'loading';
        state.form.error = null;
      })
      .addCase(updateServiceEntry.fulfilled, (state, action) => {
        state.form.status = 'succeeded';
        state.form.error = null;
        const updated = action.payload;
        state.form.lastCreatedId = updated.id;
        const index = state.entities.findIndex((entry) => entry.id === updated.id);
        if (index >= 0) {
          state.entities[index] = updated;
        }
        if (state.detail.entry && state.detail.entry.id === updated.id) {
          state.detail.entry = updated;
        }
      })
      .addCase(updateServiceEntry.rejected, (state, action) => {
        state.form.status = 'failed';
        state.form.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar la entrada de servicio';
      })
      .addCase(deleteServiceEntry.pending, (state, action) => {
        state.delete.status = 'loading';
        state.delete.error = null;
        state.delete.targetId = action.meta.arg.id;
        state.delete.message = null;
      })
      .addCase(deleteServiceEntry.fulfilled, (state, action) => {
        state.delete.status = 'succeeded';
        state.delete.error = null;
        state.delete.targetId = action.payload.id;
        state.delete.message = action.payload.message ?? null;
        state.entities = state.entities.filter((entry) => entry.id !== action.payload.id);
        if (state.detail.entry?.id === action.payload.id) {
          state.detail.entry = null;
          state.detail.status = 'idle';
        }
      })
      .addCase(deleteServiceEntry.rejected, (state, action) => {
        state.delete.status = 'failed';
        state.delete.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar la entrada de servicio';
        state.delete.message = null;
      })
      .addCase(uploadServiceEntryFiles.pending, (state) => {
        state.upload.status = 'loading';
        state.upload.error = null;
      })
      .addCase(uploadServiceEntryFiles.fulfilled, (state, action) => {
        state.upload.status = 'succeeded';
        state.upload.error = null;
        state.upload.files = action.payload.map((file) => ({
          file_id: file.id,
          original_name: file.original_name,
          extension: file.original_name.split('.').pop() ?? '',
          download_url: file.url,
        }));
      })
      .addCase(uploadServiceEntryFiles.rejected, (state, action) => {
        state.upload.status = 'failed';
        state.upload.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible subir los archivos';
      });
  },
});

export const {
  resetServiceEntriesState,
  resetServiceEntryDetail,
  resetServiceEntryForm,
  resetServiceEntryDelete,
  resetServiceEntryUpload,
} = serviceEntriesSlice.actions;

export default serviceEntriesSlice.reducer;
