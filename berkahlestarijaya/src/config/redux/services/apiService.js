import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../../utils/constants"

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // Replace with your base URL
    prepareHeaders: (headers, { getState }) => {
      // Get the token from Redux state
      const token = getState().general.token // Assuming the token is stored in `auth.token`

      // If we have a token, add it to the headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/api/profile/update",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
    }),
    getListTransaction: builder.mutation({
      query: (body) => {
        const url =
          body?.page > 1
            ? `/api/profile/transaction/lists?page=${body?.page}`
            : `/api/profile/transaction/lists`
        return {
          url,
          method: "POST",
          body,
        }
      },
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useUpdateProfileMutation,
  useLoginMutation,
  useGetListTransactionMutation,
} = apiService
