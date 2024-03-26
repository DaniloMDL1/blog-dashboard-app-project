import { api } from "../api"
const COMMENTS_URL = "/api/comments"

export const commentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation({
            query: (data) => ({
                url: `${COMMENTS_URL}/create`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Comments"]
        }),
        getPostComments: builder.query({
            query: ({ postId }) => ({
                url: `${COMMENTS_URL}/post/${postId}`,
                method: "GET"
            }),
            providesTags: ["Comments"]
        }),
        deleteComment: builder.mutation({
            query: ({ commentId }) => ({
                url: `${COMMENTS_URL}/delete/${commentId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Comments"]
        }),
        likeUnlikeComment: builder.mutation({
            query: ({ commentId }) => ({
                url: `${COMMENTS_URL}/like/${commentId}`,
                method: "PUT"
            }),
            invalidatesTags: ["Comments"]
        }),
        updateComment: builder.mutation({
            query: ({ commentId, comment }) => ({
                url: `${COMMENTS_URL}/update/${commentId}`,
                method: "PUT",
                body: { comment }
            }),
            invalidatesTags: ["Comments"]
        })
    })
})

export const { useCreateCommentMutation, useGetPostCommentsQuery, useDeleteCommentMutation, useLikeUnlikeCommentMutation, useUpdateCommentMutation } = commentsApi