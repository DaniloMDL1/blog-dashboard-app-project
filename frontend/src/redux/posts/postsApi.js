import { api } from "../api"
const POSTS_URL = "/api/posts"

export const postsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (data) => ({
                url: `${POSTS_URL}/create`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Posts"]
        }),
        getPost: builder.query({
            query: (slug, postId) => ({
                url: slug ? `${POSTS_URL}/${slug}` : `${POSTS_URL}/${postId}`,
                method: "GET",
            }),
            providesTags: ["Posts"]
        }),
        getUserPosts: builder.query({
            query: ({ userId, page }) => ({
                url: `${POSTS_URL}/user/${userId}`,
                method: "GET",
                params: { page }
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
        }),
        getAllPosts: builder.query({
            query: ({ page, pageSize }) => ({
                url: `${POSTS_URL}/all`,
                method: "GET",
                params: { page, pageSize }
            }),
            providesTags: ["Posts"]
        }),
        getRecentPosts: builder.query({
            query: () => ({
                url: `${POSTS_URL}/recent`,
                method: "GET"
            }),
            providesTags: ["Posts"]
        }),
        getSearchPosts: builder.query({
            query: ({ searchTerm, page, category }) => ({
                url: `${POSTS_URL}/search`,
                method: "GET",
                params: { searchTerm, page, category }
            }),
            providesTags: ["Posts"]
        }),
        getPopularPosts: builder.query({
            query: () => ({
                url: `${POSTS_URL}/popular`,
                method: "GET"
            }),
            providesTags: ["Posts"]
        })
    })
})

export const { useCreatePostMutation, useGetPostQuery, useGetUserPostsQuery, useDeletePostMutation, useUpdatePostMutation, useGetAllPostsQuery, useGetRecentPostsQuery, useGetSearchPostsQuery, useGetPopularPostsQuery } = postsApi