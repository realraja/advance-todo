import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const calendarApi = createApi({
    reducerPath:'calendarApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/calendar' }),
    tagTypes: ['Calendar'],
    endpoints: (builder) => ({
        get: builder.query({
            query: (date) => ({
                url: `/${date}`,
                credentials: 'include',
            }),
            keepUnusedDataFor: 0,
        }),
    }),
})

export const {
    useGetQuery,
} = calendarApi;
export default calendarApi;