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
            query: (slug, postId) => ({
                url: slug ? `${POSTS_URL}/${slug}` : `${POSTS_URL}/${postId}`,
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
        }),
        deletePost: builder.mutation({
            query: ({ postId }) => ({
                url: `${POSTS_URL}/delete/${postId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Posts"]
        }),
        updatePost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/update/${data.postId}`,
                method: "PUT",
                body: { 
                    title: data.title,
                    desc: data.desc,
                    category: data.category,
                    postPicture: data.postPicture
                }
            }),
            invalidatesTags: ["Posts"]
        })
    })
})

export const { useCreatePostMutation, useGetPostQuery, useGetUserPostsQuery, useDeletePostMutation, useUpdatePostMutation } = postsApi