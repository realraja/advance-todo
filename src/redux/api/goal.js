import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const goalApi = createApi({
    reducerPath:'goalApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/goal' }),
    tagTypes: ['Goal'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Goal'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Goal'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Goal'],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Goal'],
        }),
        complete: builder.mutation({
            query: (id) => ({
                url: `/complete/${id}`,
                method: 'PUT',
                credentials: 'include',
            }),
            invalidatesTags: ['Goal'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Goal'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation,useCompleteMutation
} = goalApi;
export default goalApi;