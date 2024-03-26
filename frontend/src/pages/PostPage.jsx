import { Link, useNavigate, useParams } from "react-router-dom"
import { useDeletePostMutation, useGetPostQuery } from "../redux/posts/postsApi"
import { Avatar, Box, Button, CircularProgress, Container, IconButton, Stack, TextField, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetUserQuery } from "../redux/user/usersApi"
import { useSelector } from "react-redux"
import { useState } from "react"
import DeletePostModal from "../components/DeletePostModal"
import { toast } from "react-toastify"
import formatCategory from "../utils/formatCategory"
import Comment from "../components/Comment"
import { useCreateCommentMutation, useGetPostCommentsQuery } from "../redux/comments/commentsApi"
import { useTheme } from "@emotion/react"

const PostPage = () => {
    const { user } = useSelector((state) => state.user)

    const theme = useTheme()

    const { slug } = useParams()
    const navigate = useNavigate()

    const [comment, setComment] = useState("")
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    // get post
    const { data, isLoading } = useGetPostQuery(slug)

    // get user
    const { data: userData } = useGetUserQuery({ userId: data?.userId}, { skip: !data?.userId})

    // delete post
    const [ deletePostApi, { isLoading: isDeletePostLoading } ] = useDeletePostMutation()

    const handleDeletePost = async () => {
        try {
            const res = await deletePostApi({ postId: data._id }).unwrap()

            toast.success("Post has been successfully deleted.")
            navigate("/your-posts")
            
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

    // create comment
    const [ createCommentApi, { isLoading: isCreateCommentLoading } ] = useCreateCommentMutation()

    // get post comments
    const { data: postCommentsData, isLoading: isPostCommentsLoading } = useGetPostCommentsQuery({ postId: data?._id }, { skip: !data?._id })

    const handleCreateComment = async (e) => {
        e.preventDefault()
        if(!user) {
            toast.error("You are not authorized to create a comment.")
            return
        }
        try {
            const res = await createCommentApi({ comment, userId: user?._id, postId: data?._id }).unwrap()

            toast.success("Comment has been created successfully.")
            setComment("")
            
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

    return (
        <>
            <Container maxWidth={"sm"} sx={{ mt: "50px", pb: "30px"}}>
                {isLoading && (
                    <Box display={"flex"} justifyContent={"center"}>
                        <CircularProgress size={24}/>
                    </Box>
                )}
                {!isLoading && !data && (
                    <Typography variant="h6" textAlign={"center"}>
                        Post not found.
                    </Typography>
                )}
                {data && (
                    <>
                        <Box>
                            <Typography sx={{ fontSize: { xs: "21px", sm: "26px"}, mb: "8px"}} fontWeight={"bold"}>
                                {data.title}
                            </Typography>
                            {data.postPicture && (
                                <img src={data.postPicture} style={{ width: "100%", borderRadius: "8px", overflow: "hidden"}}/>
                            )}
                            {user?._id === data.userId && (
                                <Stack flexDirection={"row"} alignItems={"center"} gap={2} justifyContent={"flex-end"}>
                                    <Link to={`/update-post/${data._id}`}>
                                        <IconButton sx={{ color: "#00897b"}}>
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <IconButton onClick={handleOpen} sx={{ color: "#d32f2f"}}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <DeletePostModal open={open} handleClose={handleClose} isLoading={isDeletePostLoading} handleDeletePost={handleDeletePost}/>
                                </Stack>
                            )}
                            {userData && (
                                <Box my={"10px"} px={1}>
                                    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                        <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                                            <Avatar src={userData.profilePicture} sx={{ width: { xs: 42, sm: 52 }, height: { xs: 42, sm: 52 }}}/>
                                            <Typography sx={{ fontSize: { xs: "14px", sm: "17px"}}}>
                                                {userData.fullName}
                                            </Typography>
                                        </Stack>
                                        <Typography sx={{ fontSize: { xs: "14px", sm: "17px"}}}>
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}
                            <Stack flexDirection={"row"} alignItems={"center"} gap={2} sx={{ mt: "20px", px: 1}}>
                                <Typography>Category:</Typography>
                                <Box sx={{ backgroundColor: "#311b92", p: 1, borderRadius: "9999px", color: "#ffffff"}}>
                                    {formatCategory(data.category)}
                                </Box>
                            </Stack>
                            <Typography sx={{ px: "8px", mt: "20px"}}>
                                {data.desc}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" mt={"20px"} mb={"10px"}>
                                Comments: {postCommentsData?.length}
                            </Typography>
                            <Stack onSubmit={handleCreateComment} component={"form"} flexDirection={"row"} alignItems={"center"} gap={2}>
                                <TextField 
                                    type="text"
                                    variant="standard"
                                    fullWidth
                                    placeholder="Comment"
                                    autoComplete="off"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button type="submit" disabled={isCreateCommentLoading} variant="contained" sx={{
                                    "&.Mui-disabled": {
                                        backgroundColor: theme.palette.primary.main
                                    },
                                    width: "110px",
                                    height: "38px"
                                }}>
                                    {isCreateCommentLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Comment"}
                                </Button>
                            </Stack>
                            {isPostCommentsLoading && (
                                <Box display={"flex"} justifyContent={"center"}>
                                    <CircularProgress size={24}/>
                                </Box>
                            )}
                            {!isPostCommentsLoading && postCommentsData?.length === 0 && (
                                <Typography variant="h6" textAlign={"center"} mt={"20px"}>
                                    There is no comments for this post yet.
                                </Typography>
                            )}
                            {postCommentsData && (
                                <Stack gap={3} mt={"20px"}>
                                    {postCommentsData.map((c) => (
                                        <Comment key={c._id} comment={c}/>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </>
                    
                )}
            </Container>
        </>
    )
}

export default PostPage