// src/store/store.js — Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import { leadsApi } from './leadsApi';

export const store = configureStore({
  reducer: {
    // RTK Query manages its own slice of state under this key
    [leadsApi.reducerPath]: leadsApi.reducer,
  },
  // Enables caching, invalidation, polling, and other RTK Query features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leadsApi.middleware),
});
