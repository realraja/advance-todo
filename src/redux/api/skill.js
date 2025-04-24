import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const skillApi = createApi({
    reducerPath:'skillApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/skill' }),
    tagTypes: ['Skill'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Skill'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Skill'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Skill'],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Skill'],
        }),
        updateLevel: builder.mutation({
            query: (data) => ({
                url: `/update-level`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Skill'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Skill'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation,useUpdateLevelMutation
} = skillApi;
export default skillApi;