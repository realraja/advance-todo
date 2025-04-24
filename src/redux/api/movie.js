import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/movie" }),
  tagTypes: ["Movie"],
  endpoints: (builder) => ({
    get: builder.query({
      query: () => ({
        url: "/",
        credentials: "include",
      }),
      providesTags: ["Movie"],
    }),
    getAll: builder.query({
      query: () => ({
        url: "/get-all",
        credentials: "include",
      }),
      providesTags: ["Movie"],
    }),
    add: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Movie"],
    }),
    update: builder.mutation({
      query: (data) => ({
        url: `/update`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Movie"],
    }),
    updateWatched: builder.mutation({
      query: (data) => ({
        url: `/update-watched`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Movie"],
    }),
    updateRating: builder.mutation({
      query: (data) => ({
        url: `/rating`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Movie"],
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Movie"],
    }),
  }),
});

export const {
  useGetQuery,
  useGetAllQuery,
  useAddMutation,
  useDeleteMutation,
  useUpdateMutation,
  useUpdateRatingMutation,
  useUpdateWatchedMutation,
} = movieApi;
export default movieApi;
