import { useParams } from "react-router-dom"
import { useGetPostQuery } from "../redux/posts/postsApi"
import { Avatar, Box, CircularProgress, Container, Stack, Typography } from "@mui/material"
import { useGetUserQuery } from "../redux/user/usersApi"

const PostPage = () => {
    const { slug } = useParams()

    // get post
    const { data, isLoading } = useGetPostQuery(slug)

    // get user
    const { data: userData } = useGetUserQuery({ userId: data?.userId})

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
                    <Box>
                        <Typography sx={{ fontSize: { xs: "21px", sm: "26px"}, textAlign: "center", mb: "8px"}} fontWeight={"bold"}>
                            {data.title}
                        </Typography>
                        {data.postPicture && (
                            <img src={data.postPicture} style={{ width: "100%", borderRadius: "8px", overflow: "hidden"}}/>
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
                        <Typography sx={{ px: "8px", mt: "20px"}}>
                            {data.desc}
                        </Typography>
                    </Box>
                )}
            </Container>
        </>
    )
}

export default PostPage