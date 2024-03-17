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
            })
        })
    })
})

export const { useCreatePostMutation, useGetPostQuery } = postsApi