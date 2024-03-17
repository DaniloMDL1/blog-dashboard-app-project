import { api } from "../api"
const USERS_URL = "/api/users"

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/update/profile/${data && data._id}`,
                method: "PUT",
                body: data
            })
        }),
        deleteUserAccount: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/delete/${data && data._id}`,
                method: "DELETE"
            })
        }),
        getAllUsers: builder.query({
            query: ({ page, pageSize }) => ({
                url: `${USERS_URL}/all`,
                method: "GET",
                params: { page, pageSize }
            })
        }),
        getUser: builder.query({
            query: ({ userId }) => ({
                url: `${USERS_URL}/${userId}`,
                method: "GET"
            })
        })
    })
})

export const { useUpdateUserProfileMutation, useDeleteUserAccountMutation, useGetAllUsersQuery, useGetUserQuery } = usersApi
