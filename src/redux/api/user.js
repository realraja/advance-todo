import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => ({
        url: "/user-data",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getBath: builder.query({
      query: () => ({
        url: "/bath",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    addBath: builder.mutation({
      query: (data) => ({
        url: "/bath",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getRun: builder.query({
      query: () => ({
        url: "/run",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    addRun: builder.mutation({
      query: (data) => ({
        url: "/run",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getBrush: builder.query({
      query: () => ({
        url: "/brush",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    addBrush: builder.mutation({
      query: (data) => ({
        url: "/brush",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getDidThat: builder.query({
      query: () => ({
        url: "/did-that",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    addDidThat: builder.mutation({
      query: (data) => ({
        url: "/did-that",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getImportantEvent: builder.query({
      query: () => ({
        url: "/important-event",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    addImportantEvent: builder.mutation({
      query: (data) => ({
        url: "/important-event",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateImportantEvent: builder.mutation({
      query: (data) => ({
        url: "/important-event",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteImportantEvent: builder.mutation({
      query: (data) => ({
        url: "/important-event",
        method: "DELETE",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetBathQuery,
  useGetBrushQuery,
  useGetDidThatQuery,
  useGetImportantEventQuery,
  useGetRunQuery,
  useAddBathMutation,
  useAddBrushMutation,
  useAddDidThatMutation,
  useAddImportantEventMutation,
  useAddRunMutation,
  useUpdateProfileMutation,
  useGetUserDataQuery,
  useUpdateImportantEventMutation,
  useDeleteImportantEventMutation
} = userApi;
export default userApi;
