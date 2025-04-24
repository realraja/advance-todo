import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const photoApi = createApi({
    reducerPath:'photoApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/photo' }),
    tagTypes: ['Photo'],
    endpoints: (builder) => ({
        get: builder.query({
            query: () => ({
                url: '/',
                credentials: 'include',
            }),
            providesTags: ['Photo'],
        }),
        getAll: builder.query({
            query: () => ({
                url: '/get-all',
                credentials: 'include',
            }),
            providesTags: ['Photo'],
        }),
        getAllFiles: builder.query({
            query: (id) => ({
                url: `/get-all-files/${id}`,
                credentials: 'include',
            }),
            providesTags: ['Photo'],
        }),
        add: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Photo'],
        }),
        uploadFile: builder.mutation({
            query: (data) => ({
                url: '/upload-file',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Photo'],
        }),
        secureFolder: builder.mutation({
          query: (id) => ({
            url: `/secure/${id}`,
            method: "PUT",
            credentials: "include",
          }),
          invalidatesTags: ["Password"],
        }),
        update: builder.mutation({
            query: (data) => ({
                url: `/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Photo'],
        }),
        delete: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Photo'],
        }),
    }),
})

export const {
    useGetQuery,useGetAllQuery,useAddMutation,useDeleteMutation,useUpdateMutation,useUploadFileMutation,useSecureFolderMutation,useGetAllFilesQuery
} = photoApi;
export default photoApi;