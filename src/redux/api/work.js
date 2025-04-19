import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const workApi = createApi({
    reducerPath:'workApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Work'],
    endpoints: (builder) => ({
        getWork: builder.query({
            query: () => ({
                url: 'work',
                credentials: 'include',
            }),
            providesTags: ['Work'],
        }),
        getAllWork: builder.query({
            query: () => ({
                url: 'work/get-all-work',
                credentials: 'include',
            }),
            providesTags: ['Work'],
        }),
        addWork: builder.mutation({
            query: (data) => ({
                url: 'work/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Work'],
        }),
        updateWork: builder.mutation({
            query: (data) => ({
                url: `work/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Work'],
        }),
        toggleCompleteWork: builder.mutation({
            query: (id) => ({
                url: `work/complete/${id}`,
                method: 'PUT',
                credentials: 'include'
            }),
            invalidatesTags: ['Work'],
        }),
        deleteWork: builder.mutation({
            query: (id) => ({
                url: `work/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Work'],
        }),
    }),
})

export const {
    useGetWorkQuery,
    useGetAllWorkQuery,
    useAddWorkMutation,
    useUpdateWorkMutation,
    useToggleCompleteWorkMutation,
    useDeleteWorkMutation,
} = workApi;
export default workApi;