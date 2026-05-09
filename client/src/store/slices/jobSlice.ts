import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as jobService from '../../services/jobService';
import type { Job, JobStats } from '../../types';
type AuthRoot = { auth: { token: string | null } };

export const fetchJobs = createAsyncThunk<Job[], void, { state: AuthRoot }>('jobs/fetchAll', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('unauthorized');
  try {
    return await jobService.listJobs(token);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Failed');
  }
});

export const fetchStats = createAsyncThunk<JobStats, void, { state: AuthRoot }>('jobs/fetchStats', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue('unauthorized');
  try {
    return await jobService.fetchStats(token);
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Failed');
  }
});

export interface JobState {
  items: Job[];
  stats: JobStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  items: [],
  stats: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    upsertJob(state, action: { payload: Job }) {
      const idx = state.items.findIndex((j) => j.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeJob(state, action: { payload: number }) {
      state.items = state.items.filter((j) => j.id !== action.payload);
    },
    clearJobs(state) {
      state.items = [];
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Error';
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { upsertJob, removeJob, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
