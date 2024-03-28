import { Avatar, Box, Button, CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from "@emotion/react"
import { formatDistanceToNow } from "date-fns"
import { useGetUserQuery } from "../redux/user/usersApi"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useDeleteCommentMutation, useLikeUnlikeCommentMutation, useUpdateCommentMutation } from "../redux/comments/commentsApi"
import { useState } from "react"
import DeleteCommentModal from "./DeleteCommentModal"

const Comment = ({ comment }) => {
    const { user } = useSelector((state) => state.user)

    const theme = useTheme()

    const { data: userData } = useGetUserQuery({ userId: comment.userId})

    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    // like unlike post usestate
    const [isLiked, setIsLiked] = useState(comment.likes.includes(user?._id))

    // update comment
    const [updateCommentText, setUpdateCommentText] = useState(comment.comment)
    const [isEditing, setIsEditing] = useState(false)
    const [isLikeUnlikeLoading, setIsLikeUnlikeLoading] = useState(false)

    const handleOpen = () => setOpenDeleteModal(true)
    const handleClose = () => setOpenDeleteModal(false)

    // delete comment
    const [ deleteCommentApi, { isLoading: isDeleteCommentLoading } ] = useDeleteCommentMutation()

    const handleDeleteComment = async () => {
        try {
            const res = await deleteCommentApi({ commentId: comment._id }).unwrap()

            toast.success("Comment has been successfully deleted.")
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
                return
            } else {
                toast.error(error.message)
                return
            }
        }
    }

    // like unlike comment
    const [ likeUnlikeCommentApi ] = useLikeUnlikeCommentMutation()

    const handleLikeUnlikeComment = async () => {
        if(!user) {
            toast.error("You are not authorized to like or unlike any comment.")
            return
        }
        if(isLikeUnlikeLoading) return
        setIsLikeUnlikeLoading(true)
        try {
            const res = await likeUnlikeCommentApi({ commentId: comment._id }).unwrap()

            if(isLiked) {
                toast.success("Comment has been unliked.")
            } else {
                toast.success("Comment has been liked.")
            }

            setIsLiked(!isLiked)
            setIsLikeUnlikeLoading(false)
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
                return
            } else {
                toast.error(error.message)
                return
            }
        }
    }

    // update comment
    const [ updateCommentApi, { isLoading: isUpdateCommentLoading } ] = useUpdateCommentMutation()

    const handleUpdateComment = async (e) => {
        e.preventDefault()
        setIsEditing(true)
        try {
            const res = await updateCommentApi({ commentId: comment._id, comment: updateCommentText})

            toast.success("Post has been successfully updated.")
            setIsEditing(false)
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
                setIsEditing(false)
                return
            } else {
                toast.error(error.message)
                setIsEditing(false)
                return
            }
        }
    }

    return (
        <Box>
            <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
                <Avatar src={userData?.profilePicture} sx={{ width: { xs: "30px", md: "42px"}, height: { xs: "30px", md: "42px" }}}/>
                <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                    <Typography variant="body2">
                        {userData?.username}
                    </Typography>
                    <Typography fontSize={{ xs: "12px", md: "14px"}} sx={{ color: "#AAAAAA"}}>
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </Typography>
                    {user?._id === comment.userId && (
                        <Stack flexDirection={"row"} alignItems={"center"}>
                            <IconButton onClick={handleOpen} sx={{ color: "#d32f2f"}}>
                                <DeleteIcon />
                            </IconButton>
                            <DeleteCommentModal 
                                open={openDeleteModal} 
                                handleClose={handleClose}
                                isLoading={isDeleteCommentLoading}
                                handleDeleteComment={handleDeleteComment} 
                            />
                            <IconButton onClick={() => setIsEditing(true)} sx={{ color: "#00897b"}}>
                                <EditIcon />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            {isEditing ? (
                <Box onSubmit={handleUpdateComment} component={"form"} my={2}>
                    <TextField
                        autoComplete="off"
                        multiline
                        rows={2}
                        fullWidth
                        value={updateCommentText}
                        onChange={(e) => setUpdateCommentText(e.target.value)}
                    />
                    <Stack flexDirection={"row"} alignItems={"center"} gap={2} mt={1}>
                        <Button type="submit" disabled={isUpdateCommentLoading} variant="contained" sx={{ width: "90px", height: "37px", "&.Mui-disabled": {
                        backgroundColor: theme.palette.primary.main
                        } }}>
                            {isUpdateCommentLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Save"}  
                        </Button>
                        <Button type="button" onClick={() => {
                            setIsEditing(false)
                            setUpdateCommentText(comment.comment)
                        }} variant="contained" sx={{ backgroundColor: "#757575", color: "#ffffff", "&:hover": {
                            backgroundColor: "#616161"
                        }, fontSize: {xs: "13px", sm: "15px"}, width: "90px"}}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            ) : (
                <Typography sx={{ fontSize: "16px", mt: "6px", ml: "10px"}}>
                    {comment.comment}
                </Typography>
            )}
            <Stack flexDirection={"row"} alignItems={"center"} sx={{ ml: "2px"}}>
                <IconButton onClick={handleLikeUnlikeComment} sx={{ "&:hover": {
                    backgroundColor: theme.palette.background.default
                }}}>
                    {isLiked ? <ThumbUpAltIcon sx={{ width: "27px", height: "27px"}}/> : <ThumbUpOffAltIcon sx={{ width: "27px", height: "27px"}}/>}
                </IconButton>
                <Typography fontSize={"13px"} sx={{ color: "#AAAAAA", fontWeight: "500"}}>
                    {comment.likes.length}
                </Typography>
            </Stack>
        </Box>
    )
}

export default Comment