import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const diaryApi = createApi({
    reducerPath:'diaryApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/diary' }),
    tagTypes: ['Diary'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Diary'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Diary'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Diary'],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Diary'],
        }),
        favorite: builder.mutation({
            query: (id) => ({
                url: `/favorite/${id}`,
                method: 'PUT',
                credentials: 'include'
            }),
            invalidatesTags: ['Diary'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Diary'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation,useFavoriteMutation
} = diaryApi;
export default diaryApi;