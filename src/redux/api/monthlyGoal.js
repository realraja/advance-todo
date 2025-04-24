import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const monthlyGoalApi = createApi({
    reducerPath:'monthlyGoalApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/goal/monthly' }),
    tagTypes: ['Monthly'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Monthly'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Monthly'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Monthly'],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Monthly'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Monthly'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation
} = monthlyGoalApi;
export default monthlyGoalApi;