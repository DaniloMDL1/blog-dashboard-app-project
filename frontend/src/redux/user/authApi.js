import { api } from "../api"
const AUTH_URL = "/api/auth"

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/signup`,
                method: "POST",
                body: data
            })
        }),
        signout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/signout`,
                method: "POST",
            })
        }),
        signin: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/signin`,
                method: "POST",
                body: data
            })
        })
    })
})

export const { useSignupMutation, useSignoutMutation, useSigninMutation } = authApi