import { api } from "../api"
const USERS_URL = "/api/users"

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/update/profile/${data && data._id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"]
        }),
        deleteUserAccount: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/delete/${data && data._id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["User", "Posts"]
        }),
        getAllUsers: builder.query({
            query: ({ page, pageSize }) => ({
                url: `${USERS_URL}/all`,
                method: "GET",
                params: { page, pageSize }
            }),
            providesTags: ["User"]
        }),
        getUser: builder.query({
            query: ({ userId }) => ({
                url: `${USERS_URL}/${userId}`,
                method: "GET"
            }),
            providesTags: ["User"]
        })
    })
})

export const { useUpdateUserProfileMutation, useDeleteUserAccountMutation, useGetAllUsersQuery, useGetUserQuery } = usersApi
