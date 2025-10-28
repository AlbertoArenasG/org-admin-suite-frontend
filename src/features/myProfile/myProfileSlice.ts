'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMyProfile,
  updateMyProfile,
  type MyProfile,
} from '@/features/myProfile/myProfileThunks';

interface ProfileState {
  data: MyProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface UpdateState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
}

export interface MyProfileState {
  profile: ProfileState;
  update: UpdateState;
}

const initialState: MyProfileState = {
  profile: {
    data: null,
    status: 'idle',
    error: null,
  },
  update: {
    status: 'idle',
    error: null,
    message: null,
  },
};

const myProfileSlice = createSlice({
  name: 'myProfile',
  initialState,
  reducers: {
    resetProfileUpdate(state) {
      state.update = {
        status: 'idle',
        error: null,
        message: null,
      };
    },
    setProfileData(state, action: PayloadAction<MyProfile>) {
      state.profile.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.profile.status = 'loading';
        state.profile.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.profile.status = 'succeeded';
        state.profile.data = action.payload;
        state.profile.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible cargar el perfil.';
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.update.status = 'loading';
        state.update.error = null;
        state.update.message = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.update.status = 'succeeded';
        state.update.error = null;
        state.update.message = 'Perfil actualizado correctamente.';
        state.profile.data = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.update.status = 'failed';
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el perfil.';
      });
  },
});

export const { resetProfileUpdate, setProfileData } = myProfileSlice.actions;
export default myProfileSlice.reducer;
