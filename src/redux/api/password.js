import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const passwordApi = createApi({
  reducerPath: "passwordApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/password" }),
  tagTypes: ["Password"],
  endpoints: (builder) => ({
    get: builder.query({
      query: () => ({
        url: "/",
        credentials: "include",
      }),
      providesTags: ["Password"],
    }),
    getAll: builder.query({
      query: () => ({
        url: "/get-all",
        credentials: "include",
      }),
      providesTags: ["Password"],
    }),
    add: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Password"],
    }),
    update: builder.mutation({
      query: (data) => ({
        url: `/update`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Password"],
    }),
    securePassword: builder.mutation({
      query: (id) => ({
        url: `/secure/${id}`,
        method: "PUT",
        credentials: "include"
      }),
      invalidatesTags: ["Password"],
    }),
    getPassword: builder.mutation({
      query: (data) => ({
        url: `/get-password`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      providesTags: ["Password"],
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Password"],
    }),
  }),
});

export const {
  useGetQuery,
  useGetAllQuery,
  useAddMutation,
  useDeleteMutation,
  useUpdateMutation,
  useSecurePasswordMutation,
  useGetPasswordMutation,
} = passwordApi;
export default passwordApi;
