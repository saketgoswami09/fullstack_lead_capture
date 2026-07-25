// src/store/leadsApi.js — RTK Query API slice
// Single source of truth for ALL backend communication

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leadsApi = createApi({
  reducerPath: 'leadsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Attach admin secret header on every request that needs it
    // (the prepareHeaders below checks a custom arg instead of attaching globally)
  }),

  // Cache tags used for automatic invalidation
  tagTypes: ['Leads'],

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

    // ── ADMIN ──────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/leads?search=&page=&limit=
     * Used by: AdminPage — auto-refetches when args change (search / page)
     */
    getLeads: builder.query({
      query: ({ search = '', page = 1, limit = 10, secret } = {}) => ({
        url:     '/admin/leads',
        params:  { search, page, limit },
        headers: { 'x-admin-secret': secret },
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
      query: ({ id, status, secret }) => ({
        url:     `/admin/leads/${id}/status`,
        method:  'PATCH',
        body:    { status },
        headers: { 'x-admin-secret': secret },
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
} = leadsApi;
