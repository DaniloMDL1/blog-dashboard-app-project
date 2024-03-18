import { api } from "../api"
const POSTS_URL = "/api/posts"

export const postsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/create`,
                method: "POST",
                body: data
            })
        }),
        getPost: builder.query({
            query: (slug) => ({
                url: `${POSTS_URL}/${slug}`,
                method: "GET",
            }),
            providesTags: ["Posts"]
        }),
        getUserPosts: builder.query({
            query: ({ userId }) => ({
                url: `${POSTS_URL}/user/${userId}`,
                method: "GET"
            }),
            providesTags: ["Posts"]
        })
    })
})

export const { useCreatePostMutation, useGetPostQuery, useGetUserPostsQuery } = postsApi