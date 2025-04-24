import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const fillingApi = createApi({
    reducerPath:'fillingApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/diary/filling' }),
    tagTypes: ['Filling'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Filling'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Filling'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Filling'],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Filling'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Filling'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation
} = fillingApi;
export default fillingApi;