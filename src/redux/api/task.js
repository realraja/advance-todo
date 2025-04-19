import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const taskApi = createApi({
    reducerPath:'taskApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        getTask: builder.query({
            query: () => ({
                url: 'task',
                credentials: 'include',
            }),
            providesTags: ['Task'],
        }),
        addTask: builder.mutation({
            query: (data) => ({
                url: 'task/create',
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation({
            query: (data) => ({
                url: `task/update`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        toggleCompleteTask: builder.mutation({
            query: (id) => ({
                url: `task/complete/${id}`,
                method: 'PUT',
                credentials: 'include'
            }),
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `task/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Task'],
        }),
    }),
})

export const {
    useGetTaskQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useToggleCompleteTaskMutation,
    useDeleteTaskMutation,
} = taskApi;
export default taskApi;