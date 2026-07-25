// src/store/leadsApi.js — RTK Query API slice
// Single source of truth for ALL backend communication

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leadsApi = createApi({
  reducerPath: 'leadsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Always include HTTP-only cookies in cross-origin or same-origin requests
    credentials: 'include',
  }),

  // Cache tags used for automatic invalidation
  tagTypes: ['Leads', 'Auth'],

  endpoints: (builder) => ({
    // ── PUBLIC ─────────────────────────────────────────────────────────────────

    /**
     * POST /api/leads
     * Used by: LeadForm on the public landing page
     */
    submitLead: builder.mutation({
      query: (body) => ({
        url:    '/leads',
        method: 'POST',
        body,
      }),
    }),

    // ── AUTH ───────────────────────────────────────────────────────────────────

    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query({
      query: () => '/admin/me',
      providesTags: ['Auth'],
    }),

    // ── ADMIN ──────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/leads?search=&page=&limit=
     * Used by: AdminPage — auto-refetches when args change (search / page)
     */
    getLeads: builder.query({
      query: ({ search = '', page = 1, limit = 10 } = {}) => ({
        url:     '/admin/leads',
        params:  { search, page, limit },
      }),
      // Tag every result so updateLeadStatus can bust the cache
      providesTags: (result) =>
        result?.data?.leads
          ? [
              ...result.data.leads.map(({ _id }) => ({ type: 'Leads', id: _id })),
              { type: 'Leads', id: 'LIST' },
            ]
          : [{ type: 'Leads', id: 'LIST' }],
    }),

    /**
     * PATCH /api/admin/leads/:id/status
     * Used by: LeadsTable status toggle
     * Automatically invalidates the full leads list so the table re-fetches
     */
    updateLeadStatus: builder.mutation({
      query: ({ id, status }) => ({
        url:     `/admin/leads/${id}/status`,
        method:  'PATCH',
        body:    { status },
      }),
      // Bust the whole list + the individual lead tag
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Leads', id },
        { type: 'Leads', id: 'LIST' },
      ],
    }),
  }),
});

// Auto-generated hooks — import these in components
export const {
  useSubmitLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadStatusMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = leadsApi;
